"use client";

import { useState, useEffect } from "react";
import type { CardData } from "./FlashCard";

interface CardEditModalProps {
  card: CardData | null;
  categories: string[];
  onClose: () => void;
  onSaved: () => void;
}

export function CardEditModal({
  card,
  categories,
  onClose,
  onSaved,
}: CardEditModalProps) {
  const isAdd = !card;
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (card) {
      setQuestion(card.question);
      setAnswer(card.answer);
      const inList = categories.includes(card.category);
      setCategory(inList ? card.category : "");
      setCustomCategory(inList ? "" : card.category);
    } else {
      setQuestion("");
      setAnswer("");
      setCategory("");
      setCustomCategory("");
    }
  }, [card, categories]);

  const effectiveCategory = category || customCategory;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const finalCategory = effectiveCategory.trim();
    if (!question.trim() || !finalCategory) {
      setError("질문과 카테고리는 필수입니다.");
      setSaving(false);
      return;
    }

    try {
      if (isAdd) {
        const res = await fetch("/api/cards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question.trim(),
            answer: answer.trim(),
            category: finalCategory,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "카드 추가 실패");
        }
      } else {
        const res = await fetch(`/api/cards/${card.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question.trim(),
            answer: answer.trim(),
            category: finalCategory,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "카드 수정 실패");
        }
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-zinc-200 bg-white p-6 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {isAdd ? "카드 추가" : "카드 수정"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label
              htmlFor="question"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              질문
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              required
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="질문을 입력하세요"
            />
          </div>
          <div>
            <label
              htmlFor="answer"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              답변
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              placeholder="답변을 입력하세요"
            />
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-zinc-600 dark:text-zinc-400"
            >
              카테고리
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value) setCustomCategory("");
              }}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              <option value="">선택 또는 직접 입력</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {!category && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                list="category-list"
                placeholder="새 카테고리 입력"
                className="mt-2 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
              />
            )}
            <datalist id="category-list">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium dark:border-zinc-600"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
