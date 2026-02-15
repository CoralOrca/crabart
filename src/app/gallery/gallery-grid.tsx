"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { EXPRESSIONS, OUTFITS, ACCESSORIES } from "@/lib/prompt";
import type { Generation } from "./page";

const PAGE_SIZE = 20;

function getLabel(
  list: readonly { id: string; label: string }[],
  id: string
): string {
  return list.find((item) => item.id === id)?.label ?? id;
}

export function GalleryGrid({
  initialGenerations,
  initialHasMore,
}: {
  initialGenerations: Generation[];
  initialHasMore: boolean;
}) {
  const [generations, setGenerations] = useState(initialGenerations);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(new Set());
  const sentinelRef = useRef<HTMLDivElement>(null);

  const visibleGenerations = generations.filter(
    (gen) => !brokenImageIds.has(gen.id)
  );

  const selected = selectedId
    ? visibleGenerations.find((g) => g.id === selectedId) ?? null
    : null;

  const close = useCallback(() => setSelectedId(null), []);

  const handleImageError = useCallback((id: string) => {
    setBrokenImageIds((prev) => new Set(prev).add(id));
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/gallery?offset=${generations.length}&limit=${PAGE_SIZE}`
      );
      const data = await res.json();
      if (data.generations?.length) {
        setGenerations((prev) => [...prev, ...data.generations]);
      }
      setHasMore(data.hasMore ?? false);
    } catch (err) {
      console.error("Failed to load more generations:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, generations.length]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // Close on Escape
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, close]);

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {visibleGenerations.map((gen) => (
          <button
            key={gen.id}
            onClick={() => setSelectedId(gen.id)}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gen.image_url}
              alt={`CrabArt — ${getLabel(EXPRESSIONS, gen.expression)}`}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => handleImageError(gen.id)}
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-2 pb-2 pt-6 opacity-0 transition group-hover:opacity-100">
              <p className="truncate text-xs font-medium text-white">
                {getLabel(EXPRESSIONS, gen.expression)}
              </p>
              <p className="truncate text-[10px] text-white/70">
                {getLabel(OUTFITS, gen.outfit)} &middot;{" "}
                {getLabel(ACCESSORIES, gen.accessory)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="py-8 text-center">
        {loading && (
          <p className="text-sm text-zinc-400">Loading more...</p>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={close}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white transition hover:bg-black/40"
            >
              &times;
            </button>

            {/* Image */}
            <div className="aspect-square bg-[#f5f5f0]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selected.image_url}
                alt="CrabArt"
                className="h-full w-full object-contain"
                onError={() => {
                  handleImageError(selected.id);
                  close();
                }}
              />
            </div>

            {/* Details */}
            <div className="border-t border-zinc-100 px-6 py-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    Expression
                  </p>
                  <p className="font-medium">
                    {getLabel(EXPRESSIONS, selected.expression)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    Outfit
                  </p>
                  <p className="font-medium">
                    {getLabel(OUTFITS, selected.outfit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    Accessory
                  </p>
                  <p className="font-medium">
                    {getLabel(ACCESSORIES, selected.accessory)}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-zinc-400">
                {new Date(selected.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
