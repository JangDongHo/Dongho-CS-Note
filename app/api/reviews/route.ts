import { prisma } from "@/lib/db";
import { calculateSM2 } from "@/lib/sm2";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const where = category ? { category } : {};

    const cards = await prisma.card.findMany({
      where,
      include: {
        reviews: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    const dueCards = cards.filter((card) => {
      const latestReview = card.reviews[0];
      return (
        !latestReview ||
        new Date(latestReview.nextReviewAt) <= today
      );
    });

    return NextResponse.json(dueCards);
  } catch (error) {
    console.error("GET /api/reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch due cards" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cardId, quality } = body;

    if (cardId === undefined || quality === undefined) {
      return NextResponse.json(
        { error: "cardId and quality are required" },
        { status: 400 }
      );
    }

    if (![0, 3, 5].includes(quality)) {
      return NextResponse.json(
        { error: "quality must be 0 (Again), 3 (Good), or 5 (Easy)" },
        { status: 400 }
      );
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: {
        reviews: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const lastReview = card.reviews[0];
    const prevInterval = lastReview?.interval ?? 0;
    const prevEaseFactor = lastReview?.easeFactor ?? 2.5;

    const { interval, easeFactor, nextReviewAt } = calculateSM2(
      quality,
      prevInterval,
      prevEaseFactor
    );

    await prisma.review.create({
      data: {
        cardId,
        quality,
        nextReviewAt,
        easeFactor,
        interval,
      },
    });

    return NextResponse.json({
      success: true,
      nextReviewAt,
      interval,
    });
  } catch (error) {
    console.error("POST /api/reviews:", error);
    return NextResponse.json(
      { error: "Failed to record review" },
      { status: 500 }
    );
  }
}
