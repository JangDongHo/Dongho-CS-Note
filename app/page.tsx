import { Nav } from "@/components/Nav";
import { FlashCardView } from "@/components/FlashCardView";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            CS 면접 플래시카드
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            자료구조, 운영체제, 네트워크, 데이터베이스, 컴퓨터 구조
          </p>
        </header>
        <Nav />
        <main className="mt-8 flex justify-center">
          <FlashCardView />
        </main>
      </div>
    </div>
  );
}
