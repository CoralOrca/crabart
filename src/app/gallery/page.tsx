import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { GalleryGrid } from "./gallery-grid";
import Footer from "@/components/Footer";

export const metadata = {
  title: "CrabArt Gallery",
  description: "Browse all generated CrabArt pieces",
};

export const revalidate = 60;

export interface Generation {
  id: string;
  created_at: string;
  expression: string;
  outfit: string;
  accessory: string;
  image_url: string;
}

const PAGE_SIZE = 20;

async function getGenerations(): Promise<{ generations: Generation[]; hasMore: boolean; totalCount: number }> {
  const { data, error, count } = await supabase
    .from("generations")
    .select("id, created_at, expression, outfit, accessory, image_url", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  if (error) {
    console.error("Failed to fetch generations:", error.message);
    return { generations: [], hasMore: false, totalCount: 0 };
  }
  const generations = data ?? [];
  return { generations, hasMore: generations.length === PAGE_SIZE, totalCount: count ?? 0 };
}

export default async function GalleryPage() {
  const { generations, hasMore, totalCount } = await getGenerations();

  return (
    <div className="min-h-screen bg-[#fafaf8] text-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/crabartlogo.png" alt="CrabArt" className="h-10 w-10 rounded-xl" />
              <h1 className="text-lg font-bold tracking-tight">CrabArt</h1>
            </Link>
            <Link
              href="/wtf"
              className="rounded-md bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200"
            >
              wtf?
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200"
            >
              Playground
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Gallery</h2>
          <p className="text-sm text-zinc-500">
            {totalCount} generation{totalCount !== 1 ? "s" : ""}
          </p>
        </div>

        {generations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-zinc-400">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/crabartlogo.png" alt="CrabArt" className="h-16 w-16 opacity-40" />
            <p className="text-sm">
              No generations yet. Head to the Playground to create some!
            </p>
          </div>
        ) : (
          <GalleryGrid initialGenerations={generations} initialHasMore={hasMore} totalCount={totalCount} />
        )}
      </main>

      <Footer />
    </div>
  );
}
