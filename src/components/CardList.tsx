"use client";

import { useEffect, useState } from "react";
import { CategoryFilter } from "./CategoryFilter";
import { CardEditModal } from "./CardEditModal";
import type { CardData } from "./FlashCard";

function truncate(str: string, maxLen: number) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
}

export function CardList() {
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<CardData | null | undefined>(
    undefined
  );

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  };

  const fetchCards = () => {
    setLoading(true);
    const url = category
      ? `/api/cards?category=${encodeURIComponent(category)}`
      : "/api/cards";
    fetch(url)
      .then((res) => res.json())
      .then(setCards)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCards();
  }, [category]);

  const handleAdd = () => setEditingCard(null);
  const handleEdit = (card: CardData) => setEditingCard(card);
  const handleCloseModal = () => setEditingCard(undefined);
  const handleSaved = () => {
    fetchCategories();
    fetchCards();
  };

  const handleDelete = async (card: CardData) => {
    if (!confirm(`"${truncate(card.question, 30)}" 카드를 삭제하시겠습니까?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/cards/${card.id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCards();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "삭제에 실패했습니다.");
      }
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  if (loading && cards.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-zinc-500 dark:text-zinc-400">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <CategoryFilter
          categories={categories}
          value={category}
          onChange={setCategory}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          카드 추가
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 py-12 dark:border-zinc-600">
          <p className="text-zinc-500 dark:text-zinc-400">
            {category ? "이 카테고리에 카드가 없습니다." : "카드가 없습니다."}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            카드 추가하기
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  질문
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  카테고리
                </th>
                <th className="w-24 px-4 py-3 text-right text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  작업
                </th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                >
                  <td className="px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200">
                    {truncate(c.question, 60)}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {c.category}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(c)}
                        className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c)}
                        className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingCard !== undefined && (
        <CardEditModal
          card={editingCard}
          categories={categories}
          onClose={handleCloseModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
