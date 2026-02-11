"use client";

import { useState, useCallback, useRef } from "react";
import {
  EXPRESSIONS,
  OUTFITS,
  ACCESSORIES,
  buildPrompt,
} from "@/lib/prompt";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface HistoryEntry {
  id: string;
  timestamp: number;
  expression: string;
  outfit: string;
  accessory: string;
  customNotes: string;
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
  const [customNotes, setCustomNotes] = useState("");

  // Prompt
  const [showPrompt, setShowPrompt] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentMime, setCurrentMime] = useState<string>("image/png");
  const [modelText, setModelText] = useState<string | null>(null);

  // History
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(
    null
  );

  // Ref for download link
  const downloadRef = useRef<HTMLAnchorElement>(null);

  // Build the current prompt (always uses reference images)
  const currentPrompt = buildPrompt({
    expression,
    outfit,
    accessory,
    customNotes,
  });

  // -------------------------------------------------------------------------
  // Generate
  // -------------------------------------------------------------------------

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setModelText(null);
    setSelectedHistoryId(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: currentPrompt,
          expressionId: expression,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const dataUrl = `data:${data.mimeType};base64,${data.image}`;
      setCurrentImage(dataUrl);
      setCurrentMime(data.mimeType);
      if (data.text) setModelText(data.text);

      // Add to history
      const entry: HistoryEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        expression,
        outfit,
        accessory,
        customNotes,
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
  }, [currentPrompt, expression, outfit, accessory, customNotes]);

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
    setCustomNotes(entry.customNotes);
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
    <div className="min-h-screen bg-[#fafaf8] text-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-xl">
              🦀
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                CrabArt Playground
              </h1>
              <p className="text-xs text-zinc-500">
                Nano Banana Image Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAbout(!showAbout)}
              className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200"
            >
              About
            </button>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              crabart.wtf
            </span>
          </div>
        </div>
      </header>

      {/* About Panel */}
      {showAbout && (
        <div className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-zinc-900">What is CrabArt?</h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  CrabArt is an AI-native NFT collection on Base. One new piece is generated and
                  auctioned every 24 hours, forever. Each image features the same character — a
                  stylized crustacean with a Pepe-inspired face — in a unique combination of
                  expression, outfit, and accessory.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-zinc-900">How It Works</h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Art is generated using Google&apos;s Nano Banana (Gemini 2.5 Flash Image) with a
                  locked character reference and composition mask for visual consistency. Each piece
                  varies across {EXPRESSIONS.length} expressions, {OUTFITS.length} outfits, and {ACCESSORIES.length} accessories
                  — over {(EXPRESSIONS.length * OUTFITS.length * ACCESSORIES.length).toLocaleString()} unique combinations.
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-zinc-900">Auction Economics</h3>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Each auction runs for 24 hours with a 0.001 ETH reserve price on Base.
                  Proceeds are split: 25% to the creator, 75% to the treasury. Every 10th
                  CrabArt goes directly to the founder wallet. No governance in v1 — just
                  art and auctions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
          {/* ─── Left Panel: Controls ─── */}
          <div className="space-y-6">
            {/* Variation Controls */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Variation Layers
                </h2>
                <button
                  onClick={handleRandomize}
                  className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-200"
                >
                  Randomize
                </button>
              </div>

              {/* Expression */}
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Expression
              </label>
              <select
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="mb-4 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              >
                {EXPRESSIONS.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>

              {/* Outfit */}
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Outfit
                <span className="ml-1 font-normal text-zinc-400">({OUTFITS.length})</span>
              </label>
              <select
                value={outfit}
                onChange={(e) => setOutfit(e.target.value)}
                className="mb-4 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              >
                {OUTFITS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>

              {/* Accessory */}
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Accessory
                <span className="ml-1 font-normal text-zinc-400">({ACCESSORIES.length})</span>
              </label>
              <select
                value={accessory}
                onChange={(e) => setAccessory(e.target.value)}
                className="mb-4 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              >
                {ACCESSORIES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>

              {/* Custom Notes */}
              <label className="mb-1 block text-sm font-medium text-zinc-700">
                Custom Notes{" "}
                <span className="font-normal text-zinc-400">(optional)</span>
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. &quot;Make it look more moody&quot; or &quot;Add rain drops&quot;"
                rows={3}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm placeholder:text-zinc-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </section>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-6 py-4 text-base font-semibold text-white shadow-md transition hover:bg-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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

            {/* Prompt Preview */}
            <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <button
                onClick={() => setShowPrompt(!showPrompt)}
                className="flex w-full items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Full Prompt
                </span>
                <span className="text-zinc-400">{showPrompt ? "▲" : "▼"}</span>
              </button>
              {showPrompt && (
                <div className="border-t border-zinc-100 px-6 py-4">
                  <div className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                    Reference context (prepended by API): Image 1 = character
                    reference, Image 2 = composition mask
                  </div>
                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-zinc-600">
                    {currentPrompt}
                  </pre>
                </div>
              )}
            </section>

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-zinc-400">
              <span>{EXPRESSIONS.length} expressions</span>
              <span>·</span>
              <span>{OUTFITS.length} outfits</span>
              <span>·</span>
              <span>{ACCESSORIES.length} accessories</span>
              <span>·</span>
              <span>{(EXPRESSIONS.length * OUTFITS.length * ACCESSORIES.length).toLocaleString()} combos</span>
            </div>
          </div>

          {/* ─── Right Panel: Image + History ─── */}
          <div className="space-y-6">
            {/* Image Display */}
            <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex aspect-square items-center justify-center bg-[#f5f5f0]">
                {loading ? (
                  <div className="flex flex-col items-center gap-4 text-zinc-400">
                    <SpinnerLarge />
                    <p className="text-sm">
                      Generating with Nano Banana...
                    </p>
                  </div>
                ) : currentImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={currentImage}
                    alt="Generated CrabArt"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-zinc-400">
                    <div className="text-6xl">🦀</div>
                    <p className="text-sm">
                      Select variations and hit Generate
                    </p>
                  </div>
                )}
              </div>

              {/* Model text feedback */}
              {modelText && !loading && (
                <div className="border-t border-blue-100 bg-blue-50 px-6 py-3">
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">Model:</span> {modelText}
                  </p>
                </div>
              )}

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
