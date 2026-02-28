import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "10", 10) || 10,
      50
    );

    const where = category ? { category } : {};

    const allCards = await prisma.card.findMany({
      where,
      select: { id: true, question: true, answer: true, category: true },
    });

    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    const cards = shuffled.slice(0, limit);

    return NextResponse.json(cards);
  } catch (error) {
    console.error("GET /api/quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz cards" },
      { status: 500 }
    );
  }
}
