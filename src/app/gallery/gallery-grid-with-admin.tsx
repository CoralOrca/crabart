"use client";

import { useState, useCallback, useEffect } from "react";
import { EXPRESSIONS, OUTFITS, ACCESSORIES } from "@/lib/prompt";
import { supabase } from "@/lib/supabase";
import type { Generation } from "./page";

function getLabel(
  list: readonly { id: string; label: string }[],
  id: string
): string {
  return list.find((item) => item.id === id)?.label ?? id;
}

// Image component with error handling
function SafeImage({ 
  src, 
  alt, 
  className,
  onError
}: { 
  src: string; 
  alt: string; 
  className?: string;
  onError?: () => void;
}) {
  const [isError, setIsError] = useState(false);
  
  const handleError = () => {
    setIsError(true);
    onError?.();
  };
  
  if (isError) {
    return (
      <div className={`${className} flex items-center justify-center bg-zinc-100`}>
        <div className="text-center text-zinc-400 p-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs">Image unavailable</p>
        </div>
      </div>
    );
  }
  
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}

export function GalleryGridWithAdmin({
  generations: initialGenerations,
  isAdmin = false,
}: {
  generations: Generation[];
  isAdmin?: boolean;
}) {
  const [generations, setGenerations] = useState(initialGenerations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const selected = selectedId
    ? generations.find((g) => g.id === selectedId) ?? null
    : null;

  const close = useCallback(() => setSelectedId(null), []);

  // Track broken images
  const handleImageError = useCallback((id: string) => {
    setBrokenImages(prev => new Set(prev).add(id));
  }, []);

  // Delete generation
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Are you sure you want to delete this generation?")) return;
    
    setDeleting(id);
    try {
      const { error } = await supabase
        .from("generations")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // Remove from local state
      setGenerations(prev => prev.filter(g => g.id !== id));
      setBrokenImages(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      
      // Close modal if we're viewing this item
      if (selectedId === id) {
        setSelectedId(null);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete generation");
    } finally {
      setDeleting(null);
    }
  }, [selectedId]);

  // Close on Escape
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, close]);

  // Filter out items that we know have broken images (optional)
  const visibleGenerations = generations.filter(g => !brokenImages.has(g.id));

  return (
    <>
      {/* Admin controls */}
      {isAdmin && brokenImages.size > 0 && (
        <div className="mb-4 rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="text-sm text-amber-800">
            <strong>{brokenImages.size}</strong> generation{brokenImages.size !== 1 ? 's' : ''} with broken images detected.
            {' '}
            <button
              onClick={() => {
                generations.forEach(g => {
                  if (brokenImages.has(g.id)) {
                    handleDelete(g.id);
                  }
                });
              }}
              className="underline hover:no-underline"
            >
              Delete all broken
            </button>
          </p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {generations.map((gen) => (
          <div
            key={gen.id}
            className="group relative aspect-square overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <button
              onClick={() => setSelectedId(gen.id)}
              className="absolute inset-0 z-0"
            >
              <SafeImage
                src={gen.image_url}
                alt={`CrabArt — ${getLabel(EXPRESSIONS, gen.expression)}`}
                className="h-full w-full object-cover"
                onError={() => handleImageError(gen.id)}
              />
              {!brokenImages.has(gen.id) && (
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-2 pb-2 pt-6 opacity-0 transition group-hover:opacity-100">
                  <p className="truncate text-xs font-medium text-white">
                    {getLabel(EXPRESSIONS, gen.expression)}
                  </p>
                  <p className="truncate text-[10px] text-white/70">
                    {getLabel(OUTFITS, gen.outfit)} &middot;{" "}
                    {getLabel(ACCESSORIES, gen.accessory)}
                  </p>
                </div>
              )}
            </button>
            
            {/* Admin delete button */}
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(gen.id);
                }}
                disabled={deleting === gen.id}
                className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 transition hover:bg-red-600 group-hover:opacity-100 disabled:opacity-50"
                title="Delete this generation"
              >
                {deleting === gen.id ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            )}
          </div>
        ))}
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
              <SafeImage
                src={selected.image_url}
                alt="CrabArt"
                className="h-full w-full object-contain"
                onError={() => handleImageError(selected.id)}
              />
            </div>

            {/* Details */}
            <div className="border-t border-zinc-100 px-6 py-4">
              <div className="flex items-center justify-between">
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
                
                {/* Admin delete in modal */}
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(selected.id)}
                    disabled={deleting === selected.id}
                    className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    {deleting === selected.id ? "Deleting..." : "Delete"}
                  </button>
                )}
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