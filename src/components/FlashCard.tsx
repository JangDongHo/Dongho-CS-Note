"use client";

import { useState } from "react";

export interface CardData {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FlashCardProps {
  card: CardData;
  index: number;
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
}

export function FlashCard({ card, index, total, onPrev, onNext }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped((prev) => !prev);

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        {index + 1} / {total}
      </div>

      <button
        type="button"
        onClick={handleFlip}
        className="relative h-64 w-full cursor-pointer"
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative h-full w-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
            style={{ backfaceVisibility: "hidden" }}
          >
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {card.category}
            </span>
            <p className="mt-2 text-center text-lg font-medium text-zinc-800 dark:text-zinc-200">
              {card.question}
            </p>
            <span className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
              클릭하여 답변 보기
            </span>
          </div>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-700 dark:bg-zinc-800"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
              {card.category}
            </span>
            <p className="mt-2 text-center text-lg text-zinc-700 dark:text-zinc-300">
              {card.answer || "(답변을 입력해 주세요)"}
            </p>
          </div>
        </div>
      </button>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium disabled:opacity-40 dark:border-zinc-600"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index >= total - 1}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium disabled:opacity-40 dark:border-zinc-600"
        >
          다음
        </button>
      </div>
    </div>
  );
}
