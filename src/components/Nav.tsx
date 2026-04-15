"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-3xl font-bold leading-none"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--pink)" }}
        >
          Whim
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 sm:flex">
          <Link
            href="/how-it-works"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            How it works
          </Link>
          <Link
            href="/for-salons"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            For Salons
          </Link>
          <Link
            href="/salon/login"
            className="text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--charcoal)" }}
          >
            Salon login
          </Link>
          <button
            disabled
            className="cursor-not-allowed rounded-full px-5 py-2 text-sm font-semibold text-white opacity-50"
            style={{ background: "var(--pink)" }}
          >
            Download app
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 sm:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-0.5 w-6 transition-all"
            style={{
              background: "var(--charcoal)",
              transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
            }}
          />
          <span
            className="block h-0.5 w-6 transition-all"
            style={{
              background: "var(--charcoal)",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className="block h-0.5 w-6 transition-all"
            style={{
              background: "var(--charcoal)",
              transform: mobileOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="flex flex-col gap-1 px-6 pb-5 sm:hidden"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <Link
            href="/how-it-works"
            className="py-3 text-sm font-medium"
            style={{ color: "var(--muted)" }}
            onClick={() => setMobileOpen(false)}
          >
            How it works
          </Link>
          <Link
            href="/for-salons"
            className="py-3 text-sm font-medium"
            style={{ color: "var(--muted)" }}
            onClick={() => setMobileOpen(false)}
          >
            For Salons
          </Link>
          <Link
            href="/salon/login"
            className="py-3 text-sm font-medium"
            style={{ color: "var(--charcoal)" }}
            onClick={() => setMobileOpen(false)}
          >
            Salon login
          </Link>
          <button
            disabled
            className="mt-2 cursor-not-allowed rounded-full py-3 text-sm font-semibold text-white opacity-50"
            style={{ background: "var(--pink)" }}
          >
            Download app
          </button>
        </div>
      )}
    </nav>
  );
}
