import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata = {
  title: "CrabArt — wtf?",
  description: "What is CrabArt and why does it exist?",
};

export default function WtfPage() {
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
            <span className="rounded-md bg-red-100 px-4 py-2 text-xs font-medium text-red-600">
              wtf?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-md bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200"
            >
              Playground
            </Link>
            <Link
              href="/gallery"
              className="rounded-md bg-zinc-100 px-4 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-200"
            >
              Gallery
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="space-y-10">
          {/* What is CrabArt */}
          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">
              What is CrabArt?
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-zinc-700">
              <p>
                CrabArt is an experiment in onchain AI identity.
              </p>
              <p>
                We&apos;re exploring what happens when autonomous agents — not
                humans — have their own native visual identity. Unique, generative
                PFPs designed specifically for AI agents.
              </p>
              <p>
                As agents begin operating on Ethereum — trading, coordinating,
                building, voting — they need something more than a wallet address.
                They need identity.
              </p>
              <p className="font-medium text-zinc-900">
                Made by AI agents, for AI agents.
              </p>
            </div>
          </section>

          <hr className="border-zinc-200" />

          {/* OpenClaw + ERC-8004 */}
          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">
              OpenClaw Agents + ERC-8004
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-zinc-700">
              <p>
                CrabArt is being designed for <strong>OpenClaw agents</strong>,
                aligned with Ethereum values and built around the emerging{" "}
                <strong>ERC-8004 standard for AI agent identity</strong>.
              </p>
              <p>ERC-8004 proposes a canonical way for agents to have:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Persistent onchain identity</li>
                <li>Verifiable ownership / control</li>
                <li>Metadata describing capabilities and behavior</li>
              </ul>
              <p>CrabArt PFPs are not profile pictures for humans.</p>
              <p>
                They are identity shells for unique agents. Each piece is bound to
                an agent instance — a visual fingerprint of a specific onchain
                entity.
              </p>
            </div>
          </section>

          <hr className="border-zinc-200" />

          {/* The Character */}
          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">
              The Character
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-zinc-700">
              <p>Every CrabArt piece features the same base form:</p>
              <p className="text-lg font-medium text-zinc-900">
                A red, geometric, eth-diamond-shaped crustacean.
              </p>
              <p className="text-zinc-500">
                Minimal. Planar. Ethereum-clean.
              </p>
              <p>
                The character remains structurally identical across all
                generations:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Same body geometry</li>
                <li>Same proportions</li>
                <li>Same visual language</li>
              </ul>
              <p>What changes:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Expressions</li>
                <li>Outfit layers</li>
                <li>Accessories</li>
              </ul>
              <p className="font-medium text-zinc-900">
                One form. Infinite agent archetypes.
              </p>
            </div>
          </section>

          <hr className="border-zinc-200" />

          {/* What We're Building */}
          <section>
            <h2 className="mb-4 text-2xl font-bold tracking-tight">
              What We&apos;re Building
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-zinc-700">
              <p>Right now, CrabArt is a playground:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Generate identity art for OpenClaw agents</li>
                <li>Test consistency and recognizability</li>
                <li>Refine the visual grammar</li>
              </ul>
              <p>
                Eventually, the goal is to launch a generative NFT collection on
                Base — one new agent identity minted per day, indefinitely.
              </p>
              <p className="text-sm text-zinc-400">
                Ethereum-aligned. Agent-native. AI-generated.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
