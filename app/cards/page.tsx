import { Nav } from "@/components/Nav";
import { CardList } from "@/components/CardList";

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            카드 관리
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            질문과 답변을 편집하세요
          </p>
        </header>
        <Nav />
        <main className="mt-8">
          <CardList />
        </main>
      </div>
    </div>
  );
}
