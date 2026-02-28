import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import * as fs from "fs";
import * as path from "path";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

interface ParsedCard {
  question: string;
  category: string;
}

function parseQuestionsFile(filePath: string): ParsedCard[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const sections = content.split(/\n---\n/).filter((s) => s.trim());

  const cards: ParsedCard[] = [];

  for (const section of sections) {
    const lines = section.trim().split("\n");
    if (lines.length === 0) continue;

    // First line is header: # **📚 1️⃣ 자료구조 (20)**
    const header = lines[0];
    // Extract category: "자료구조", "운영체제", etc. - Korean text before (number)
    const categoryMatch = header.match(/([가-힣]+(?:\s+[가-힣]+)?)\s*\(\d+\)/);
    const category = categoryMatch ? categoryMatch[1].trim() : "기타";

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Match "1. 질문내용?" or "10. 질문내용?"
      const questionMatch = line.match(/^\d+\.\s+(.+)$/);
      if (questionMatch) {
        cards.push({
          question: questionMatch[1].trim(),
          category,
        });
      }
    }
  }

  return cards;
}

async function main() {
  const questionsPath = path.join(
    process.cwd(),
    "cs-interview-questions.md"
  );

  if (!fs.existsSync(questionsPath)) {
    console.error("Questions file not found:", questionsPath);
    process.exit(1);
  }

  const cards = parseQuestionsFile(questionsPath);
  console.log(`Parsed ${cards.length} questions from ${questionsPath}`);

  // Clear existing cards (for re-seeding)
  await prisma.review.deleteMany();
  await prisma.card.deleteMany();

  for (const card of cards) {
    await prisma.card.create({
      data: {
        question: card.question,
        answer: "",
        category: card.category,
      },
    });
  }

  console.log(`Seeded ${cards.length} cards`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
