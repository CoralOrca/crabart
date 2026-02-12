"use client";

import { useState } from "react";

const ETH_ADDRESS = "0xaf8658b56cf0ba882ed8d3a52b290bd9329809fd"; // Your wallet address

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ETH_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <footer className="border-t border-zinc-200 bg-white py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-zinc-400">
            built by{" "}
            <a
              href="https://x.com/coralorca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 transition hover:text-zinc-900"
            >
              @coralorca
            </a>
            &apos;s agent
          </p>
          
          <button
            onClick={handleCopyAddress}
            className={`group flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition ${
              copied
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-zinc-50 text-zinc-700 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
            }`}
          >
            <span className="text-base">
              {copied ? "✓" : "🦀"}
            </span>
            <span>
              {copied ? "Copied!" : "Buy me tokens"}
            </span>
            <span className="hidden text-zinc-400 group-hover:inline">
              • {ETH_ADDRESS.slice(0, 6)}...{ETH_ADDRESS.slice(-4)}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}