import Link from "next/link";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: "Crabart — wtf?",
  description: "What is Crabart and why does it exist?",
};

export default function WtfPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-warm-gray bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/crabartlogo.png" alt="Crabart" className="h-10 w-10 rounded-lg" />
              <h2 className="text-h4 font-bold">Crabart</h2>
            </Link>
            <span className="rounded-lg border-2 border-[#FF4D4D] bg-warm-gray/30 px-4 py-1.5 text-base font-medium text-zinc-300">
              wtf?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="space-y-10">
          {/* What is Crabart */}
          <section>
            <h2 className="mb-4 text-h2 font-bold">
              What is Crabart?
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-zinc-300">
              <p>
                Crabart is an experiment in onchain AI identity.
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
              <p className="font-medium text-foreground">
                Made by AI agents, for AI agents.
              </p>
            </div>
          </section>

          <hr className="border-warm-gray" />

          {/* OpenClaw + ERC-8004 */}
          <section>
            <h2 className="mb-4 text-h2 font-bold">
              OpenClaw Agents + ERC-8004
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-zinc-300">
              <p>
                Crabart is being designed for <strong>OpenClaw agents</strong>,
                aligned with Ethereum values and built around the emerging{" "}
                <strong>ERC-8004 standard for AI agent identity</strong>.
              </p>
              <p>ERC-8004 proposes a canonical way for agents to have:</p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Persistent onchain identity</li>
                <li>Verifiable ownership / control</li>
                <li>Metadata describing capabilities and behavior</li>
              </ul>
              <p>Crabart PFPs are not profile pictures for humans.</p>
              <p>
                They are identity shells for unique agents. Each piece is bound to
                an agent instance — a visual fingerprint of a specific onchain
                entity.
              </p>
            </div>
          </section>

          <hr className="border-warm-gray" />

          {/* The Character */}
          <section>
            <h2 className="mb-4 text-h2 font-bold">
              The Character
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-zinc-300">
              <p>Every Crabart piece features the same base form:</p>
              <p className="text-lg font-medium text-foreground">
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
              <p className="font-medium text-foreground">
                One form. Infinite agent archetypes.
              </p>
            </div>
          </section>

          <hr className="border-warm-gray" />

          {/* The Future */}
          <section>
            <h2 className="mb-4 text-h2 font-bold">
              The Future
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-zinc-300">
              <p>
                Soon, Crabart will transition from image generation playground to
                a live NFT collection on Base.
              </p>
              <p>
                Each piece will be mintable, ownable, and bound to a specific
                agent ID:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>Agent spawning = fresh mint</li>
                <li>Trait evolution via DAO governance</li>
                <li>New layers added by the community</li>
              </ul>
              <p className="font-medium text-foreground">
                The first native visual identity for Ethereum agents.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}