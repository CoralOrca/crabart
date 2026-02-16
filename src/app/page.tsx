"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  EXPRESSIONS,
  OUTFITS,
  ACCESSORIES,
  buildPrompt,
} from "@/lib/prompt";
import { createClient } from "@supabase/supabase-js";
import Footer from "@/components/Footer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HistoryEntry {
  id: string;
  timestamp: number;
  expression: string;
  outfit: string;
  accessory: string;
  imageDataUrl: string;
  prompt: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlaygroundPage() {
  // Variation controls
  const [expression, setExpression] = useState<string>(EXPRESSIONS[0].id);
  const [outfit, setOutfit] = useState<string>(OUTFITS[0].id);
  const [accessory, setAccessory] = useState<string>(ACCESSORIES[0].id);


  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentMime, setCurrentMime] = useState<string>("image/png");

  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null
  );

  // Latest image from Supabase (shown as muted background)
  const [latestImageUrl, setLatestImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    const sb = createClient(url, key);
    sb.from("generations")
      .select("image_url")
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data?.[0]?.image_url) {
          setLatestImageUrl(data[0].image_url);
        }
      });
  }, []);

  // Ref for download link
  const downloadRef = useRef<HTMLAnchorElement>(null);

  // Build the current prompt (always uses reference images)
  const currentPrompt = buildPrompt({
    expression,
    outfit,
    accessory,
    customNotes: "",
  });

  // -------------------------------------------------------------------------
  // Generate
  // -------------------------------------------------------------------------

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedHistoryId(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt,
          expressionId: expression,
          outfit,
          accessory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const dataUrl = `data:${data.mimeType};base64,${data.image}`;
      setCurrentImage(dataUrl);
      setCurrentMime(data.mimeType);

      // Add to history
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        expression,
        outfit,
        accessory,
        imageDataUrl: dataUrl,
        prompt: currentPrompt,
      };
      setHistory((prev) => [entry, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [currentPrompt, expression, outfit, accessory]);

  // -------------------------------------------------------------------------
  // Download
  // -------------------------------------------------------------------------

  const handleDownload = useCallback(() => {
    if (!currentImage || !downloadRef.current) return;
    const ext = currentMime.includes("png") ? "png" : "jpg";
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    downloadRef.current.href = currentImage;
    downloadRef.current.download = `crabart-${expression}-${timestamp}.${ext}`;
    downloadRef.current.click();
  }, [currentImage, currentMime, expression]);

  // -------------------------------------------------------------------------
  // Select from history
  // -------------------------------------------------------------------------

  const handleSelectHistory = useCallback((entry: HistoryEntry) => {
    setCurrentImage(entry.imageDataUrl);
    setExpression(entry.expression);
    setOutfit(entry.outfit);
    setAccessory(entry.accessory);
    setSelectedHistoryId(entry.id);
  }, []);

  // -------------------------------------------------------------------------
  // Randomize
  // -------------------------------------------------------------------------

  const handleRandomize = useCallback(() => {
    const randItem = <T,>(arr: readonly T[]): T =>
      arr[Math.floor(Math.random() * arr.length)];
    setExpression(randItem(EXPRESSIONS).id);
    setOutfit(randItem(OUTFITS).id);
    setAccessory(randItem(ACCESSORIES).id);
  }, []);

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-700 bg-zinc-800/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-tight">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/crabartlogo.png" alt="CrabArt" className="h-10 w-10 rounded-default" />
              <h1 className="text-h4 font-bold">
                CrabArt
              </h1>
            </Link>
            <Link
              href="/wtf"
              className="rounded-lg bg-zinc-700/30 px-4 py-2 text-base font-medium text-zinc-100 transition hover:bg-zinc-700/40"
            >
              wtf?
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/gallery"
              className="rounded-lg bg-zinc-700/30 px-4 py-2 text-base font-medium text-zinc-100 transition hover:bg-zinc-700/40"
            >
              Gallery
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
          {/* ─── Left Panel: Controls ─── */}
          <div className="space-y-6">
            {/* Variation Controls */}
            <section className="rounded-2xl border border-zinc-700 bg-zinc-800/50 p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-h4 uppercase text-soft-white/60">
                  Variation Layers
                </h2>
                <button
                  onClick={handleRandomize}
                  className="rounded-lg bg-zinc-700/30 px-3 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700/40"
                >
                  Randomize
                </button>
              </div>

              {/* Expression */}
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                Expression
              </label>
              <select
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="mb-4 w-full rounded-lg border border-zinc-600 bg-zinc-700 px-3 py-2.5 text-sm text-zinc-100 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                {EXPRESSIONS.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>

              {/* Outfit */}
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                Outfit
                <span className="ml-1 font-normal text-zinc-500">({OUTFITS.length})</span>
              </label>
              <select
                value={outfit}
                onChange={(e) => setOutfit(e.target.value)}
                className="mb-4 w-full rounded-lg border border-zinc-600 bg-zinc-700 px-3 py-2.5 text-sm text-zinc-100 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                {OUTFITS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* Accessory */}
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                Accessory
                <span className="ml-1 font-normal text-zinc-500">({ACCESSORIES.length})</span>
              </label>
              <select
                value={accessory}
                onChange={(e) => setAccessory(e.target.value)}
                className="mb-4 w-full rounded-lg border border-zinc-600 bg-zinc-700 px-3 py-2.5 text-sm text-zinc-100 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                {ACCESSORIES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>

            </section>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FF4D4D] px-6 py-4 text-base font-semibold text-white shadow-md transition hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : (
                "Generate CrabArt"
              )}
            </button>

          </div>

          {/* ─── Right Panel: Image + History ─── */}
          <div className="space-y-6">
            {/* Image Display */}
            <section className="relative overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-800/50 shadow-sm">
              <div className="flex aspect-square items-center justify-center bg-[#f5f5f0]">
                {loading ? (
                  <div className="flex flex-col items-center gap-4 text-zinc-400">
                    <SpinnerLarge />
                    <p className="text-sm">Generating...</p>
                  </div>
                ) : currentImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={currentImage}
                    alt="Generated CrabArt"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center">
                    {latestImageUrl && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={latestImageUrl}
                          alt=""
                          className="absolute inset-0 h-full w-full object-contain"
                        />
                        {/* Beige muting overlay */}
                        <div className="absolute inset-0 bg-[#f5f0e8]/75" />
                      </>
                    )}
                    <div className="relative z-10 flex flex-col items-center gap-4">
                      <p className="text-xl font-semibold text-zinc-600">
                        Select variations and hit Generate
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="border-t border-red-100 bg-red-50 px-6 py-3">
                  <p className="text-sm text-red-700">
                    <span className="font-semibold">Error:</span> {error}
                  </p>
                </div>
              )}

              {/* Actions */}
              {currentImage && !loading && (
                <div className="flex gap-2 border-t border-zinc-100 px-6 py-3">
                  <button
                    onClick={handleDownload}
                    className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                  >
                    Download PNG
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Regenerate
                  </button>
                </div>
              )}
            </section>

            {/* History */}
            {history.length > 0 && (
              <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Generation History{" "}
                  <span className="font-normal text-zinc-400">
                    ({history.length})
                  </span>
                </h2>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                  {history.map((entry) => (
                    <button
                      key={entry.id}
                      onClick={() => handleSelectHistory(entry)}
                      className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition ${
                        selectedHistoryId === entry.id
                          ? "border-red-400 shadow-md"
                          : "border-transparent hover:border-zinc-300"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={entry.imageDataUrl}
                        alt={`CrabArt #${entry.expression}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-1.5 pb-1 pt-4 opacity-0 transition group-hover:opacity-100">
                        <p className="truncate text-[10px] font-medium text-white">
                          {
                            EXPRESSIONS.find((e) => e.id === entry.expression)
                              ?.label
                          }
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Hidden download anchor */}
      <a ref={downloadRef} className="hidden" />

      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small spinner for button
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Large spinner for canvas
// ---------------------------------------------------------------------------

function SpinnerLarge() {
  return (
    <svg
      className="h-12 w-12 animate-spin text-red-400"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
