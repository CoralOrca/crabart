"use client";

export default function Footer() {
  return (
    <footer className="border-t border-warm-gray/50 bg-warm-gray py-major">
      <div className="mx-auto max-w-7xl px-section">
        <div className="flex flex-col items-center justify-center gap-standard">
          <p className="text-body text-soft-white/80">
            built by{" "}
            <a
              href="https://x.com/coralorca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-soft-white font-medium transition-default hover:text-primary-accent"
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