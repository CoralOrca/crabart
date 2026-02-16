"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { EXPRESSIONS, OUTFITS, ACCESSORIES } from "@/lib/prompt";
import type { Generation } from "@/lib/types";

const PAGE_SIZE = 20;
const EXPRESSION_LABELS: ReadonlyMap<string, string> = new Map(
  EXPRESSIONS.map(({ id, label }) => [id, label])
);
const OUTFIT_LABELS: ReadonlyMap<string, string> = new Map(
  OUTFITS.map(({ id, label }) => [id, label])
);
const ACCESSORY_LABELS: ReadonlyMap<string, string> = new Map(
  ACCESSORIES.map(({ id, label }) => [id, label])
);

function getLabel(
  labels: ReadonlyMap<string, string>,
  id: string
): string {
  return labels.get(id) ?? id;
}

export function GalleryGrid({
  initialGenerations = [],
  initialHasMore = true,
  totalCount = 0,
  showHeader = false,
}: {
  initialGenerations?: Generation[];
  initialHasMore?: boolean;
  totalCount?: number;
  showHeader?: boolean;
} = {}) {
  const [generations, setGenerations] = useState(initialGenerations);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  // Client-side initial fetch when no server-side data is provided
  useEffect(() => {
    if (initialGenerations.length > 0) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/gallery?offset=0&limit=${PAGE_SIZE}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        if (data.generations?.length) {
          setGenerations(data.generations);
        }
        setHasMore(data.hasMore ?? false);
      } catch (err) {
        console.error("Failed to load gallery:", err);
        if (!cancelled) setHasMore(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [initialGenerations.length]);
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
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.generations?.length) {
        setGenerations((prev) => [...prev, ...data.generations]);
      }
      setHasMore(data.hasMore ?? false);
    } catch (err) {
      console.error("Failed to load more generations:", err);
      setHasMore(false);
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

  const displayCount = totalCount || generations.length;

  return (
    <>
      {showHeader && (
        <h2 className="mb-6 text-2xl font-bold">
          Gallery{" "}
          {displayCount > 0 && (
            <span className="font-normal text-zinc-500">{displayCount}</span>
          )}
        </h2>
      )}
      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {visibleGenerations.map((gen) => (
          <button
            key={gen.id}
            onClick={() => setSelectedId(gen.id)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-warm-gray bg-surface shadow-sm transition hover:shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gen.image_url}
              alt={`Crabart — ${getLabel(EXPRESSION_LABELS, gen.expression)}`}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => handleImageError(gen.id)}
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-2 pb-2 pt-6 opacity-0 transition group-hover:opacity-100">
              <p className="truncate text-xs font-medium text-white">
                {getLabel(EXPRESSION_LABELS, gen.expression)}
              </p>
              <p className="truncate text-[10px] text-white/70">
                {getLabel(OUTFIT_LABELS, gen.outfit)} &middot;{" "}
                {getLabel(ACCESSORY_LABELS, gen.accessory)}
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
            className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-surface shadow-xl"
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
                alt="Crabart"
                className="h-full w-full object-contain"
                onError={() => {
                  handleImageError(selected.id);
                  close();
                }}
              />
            </div>

            {/* Details */}
            <div className="border-t border-warm-gray px-6 py-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    Expression
                  </p>
                  <p className="font-medium">
                    {getLabel(EXPRESSION_LABELS, selected.expression)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    Outfit
                  </p>
                  <p className="font-medium">
                    {getLabel(OUTFIT_LABELS, selected.outfit)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-400">
                    Accessory
                  </p>
                  <p className="font-medium">
                    {getLabel(ACCESSORY_LABELS, selected.accessory)}
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
