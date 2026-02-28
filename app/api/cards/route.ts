import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const where = category ? { category } : {};

    const cards = await prisma.card.findMany({
      where,
      orderBy: { id: "asc" },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("GET /api/cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer = "", category } = body;

    if (!question || !category) {
      return NextResponse.json(
        { error: "question and category are required" },
        { status: 400 }
      );
    }

    const card = await prisma.card.create({
      data: { question, answer, category },
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("POST /api/cards:", error);
    return NextResponse.json(
      { error: "Failed to create card" },
      { status: 500 }
    );
  }
}
