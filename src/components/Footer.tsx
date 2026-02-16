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
    <footer className="border-t border-warm-gray bg-surface py-section">
      <div className="mx-auto max-w-7xl px-section">
        <div className="flex flex-col items-center justify-between gap-standard sm:flex-row">
          <p className="text-caption text-warm-gray">
            built by{" "}
            <a
              href="https://x.com/coralorca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft-white transition-default hover:text-primary-accent"
            >
              @coralorca
            </a>
            &apos;s openclaw
          </p>
          
          <button
            onClick={handleCopyAddress}
            className={`group flex items-center gap-tight rounded-default px-standard py-tight text-caption font-medium transition-default ${
              copied
                ? "bg-success/10 text-success border border-success/30"
                : "bg-warm-gray/20 text-soft-white border border-warm-gray/40 hover:bg-warm-gray/30 hover:border-warm-gray/60"
            }`}
          >
            <span className="text-body">
              {copied ? "✓" : "🦞"}
            </span>
            <span>
              {copied ? "Copied!" : "Buy my agent tokens"}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}