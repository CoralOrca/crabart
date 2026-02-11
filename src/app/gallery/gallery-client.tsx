"use client";

import Link from "next/link";
import { GalleryGridWithAdmin } from "./gallery-grid-with-admin";
import Footer from "@/components/Footer";
import { useSearchParams } from "next/navigation";
import type { Generation } from "./page";

export default function GalleryClient({
  generations,
}: {
  generations: Generation[];
}) {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

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
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200"
            >
              wtf?
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200"
            >
              Playground
            </Link>
            {isAdmin && (
              <Link
                href="/gallery"
                className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-600"
              >
                Admin Mode
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Gallery</h2>
          <p className="text-sm text-zinc-500">
            {generations.length} generation{generations.length !== 1 ? "s" : ""}
            {isAdmin && " — Admin mode enabled"}
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
          <GalleryGridWithAdmin generations={generations} isAdmin={isAdmin} />
        )}
      </main>

      <Footer />
    </div>
  );
}