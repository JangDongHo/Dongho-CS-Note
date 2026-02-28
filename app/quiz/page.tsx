import { Nav } from "@/components/Nav";
import Link from "next/link";

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            퀴즈 모드
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            랜덤 출제로 실력 테스트
          </p>
        </header>
        <Nav />
        <main className="mt-8 flex flex-col items-center justify-center gap-4 py-16">
          <p className="text-zinc-500">준비 중입니다.</p>
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            플래시카드로 돌아가기
          </Link>
        </main>
      </div>
    </div>
  );
}
