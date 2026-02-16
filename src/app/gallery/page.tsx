import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { GalleryGrid } from "./gallery-grid";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "Crabart Gallery",
  description: "Browse all generated Crabart pieces",
};

export const revalidate = 60;

import type { Generation } from "@/lib/types";
export type { Generation };

const PAGE_SIZE = 20;

async function getGenerations(): Promise<{ generations: Generation[]; hasMore: boolean; totalCount: number }> {
  if (!supabase) {
    console.warn("Supabase is not configured. Gallery is running in empty-state mode.");
    return { generations: [], hasMore: false, totalCount: 0 };
  }

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-warm-gray bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/crabartlogo.png" alt="Crabart" className="h-10 w-10 rounded-lg" />
              <h1 className="text-h4 font-bold">Crabart</h1>
            </Link>
            <Link
              href="/wtf"
              className="rounded-lg bg-warm-gray/30 px-4 py-2 text-base font-medium text-foreground transition hover:bg-warm-gray/40"
            >
              wtf?
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-lg bg-warm-gray/30 px-4 py-2 text-base font-medium text-foreground transition hover:bg-warm-gray/40"
            >
              Playground
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-h3 font-bold">Gallery</h2>
          <p className="text-sm text-zinc-400">
            {totalCount} generation{totalCount !== 1 ? "s" : ""}
          </p>
        </div>

        {generations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-zinc-400">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/crabartlogo.png" alt="Crabart" className="h-16 w-16 opacity-40" />
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
