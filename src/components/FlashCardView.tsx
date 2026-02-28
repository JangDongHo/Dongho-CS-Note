"use client";

import { useEffect, useState } from "react";
import { FlashCard, type CardData } from "./FlashCard";
import { CategoryFilter } from "./CategoryFilter";

export function FlashCardView() {
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [cards, setCards] = useState<CardData[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = category
      ? `/api/cards?category=${encodeURIComponent(category)}`
      : "/api/cards";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCards(data);
        setIndex(0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  if (loading && cards.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-zinc-500">로딩 중...</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-2">
        <p className="text-zinc-500">카드가 없습니다.</p>
        <p className="text-sm text-zinc-400">
          카드 관리에서 답변을 추가하거나 시드를 실행해 주세요.
        </p>
      </div>
    );
  }

  const currentCard = cards[index];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <CategoryFilter
        categories={categories}
        value={category}
        onChange={setCategory}
      />
      <FlashCard
        card={currentCard}
        index={index}
        total={cards.length}
        onPrev={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => setIndex((i) => Math.min(cards.length - 1, i + 1))}
      />
    </div>
  );
}
