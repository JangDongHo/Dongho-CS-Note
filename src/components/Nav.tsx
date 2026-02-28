"use client";

import Link from "next/link";

const navItems = [
  { href: "/", label: "플래시카드" },
  { href: "/review", label: "복습" },
  { href: "/quiz", label: "퀴즈" },
  { href: "/cards", label: "카드 관리" },
];

export function Nav() {
  return (
    <nav className="flex gap-4 border-b border-zinc-200 py-4 dark:border-zinc-700">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
