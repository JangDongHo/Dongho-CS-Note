"use client";

interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
  label?: string;
}

export function CategoryFilter({
  categories,
  value,
  onChange,
  label = "카테고리",
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="category" className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>
      <select
        id="category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
      >
        <option value="">전체</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
