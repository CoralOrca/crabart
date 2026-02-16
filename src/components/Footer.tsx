"use client";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-700 bg-zinc-800 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-base text-zinc-400">
            built by{" "}
            <a
              href="https://x.com/coralorca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-100 font-medium transition hover:text-red-400"
            >
              @coralorca
            </a>
            &apos;s openclaw
          </p>
        </div>
      </div>
    </footer>
  );
}