"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const linkStyle = (href: string): React.CSSProperties => ({
    color: isActive(href) ? "var(--pink)" : "var(--muted)",
    fontWeight: isActive(href) ? 600 : 500,
    transition: "color 0.15s ease, opacity 0.15s ease",
    textDecoration: "none",
    position: "relative",
  });

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        transition: "background 0.2s ease",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-3xl font-bold leading-none transition-opacity hover:opacity-80"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--pink)" }}
        >
          Whim
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 sm:flex">
          <Link
            href="/how-it-works"
            className="text-sm hover:opacity-70"
            style={linkStyle("/how-it-works")}
          >
            How it works
            {isActive("/how-it-works") && (
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "var(--pink)" }}
              />
            )}
          </Link>
          <Link
            href="/for-salons"
            className="text-sm hover:opacity-70"
            style={linkStyle("/for-salons")}
          >
            For salons
            {isActive("/for-salons") && (
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "var(--pink)" }}
              />
            )}
          </Link>
          <Link
            href="/salon/login"
            className="text-sm hover:opacity-70"
            style={linkStyle("/salon")}
          >
            Salon login
            {isActive("/salon") && (
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "var(--pink)" }}
              />
            )}
          </Link>
          <div className="relative group">
            <button
              disabled
              className="rounded-full px-5 py-2 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
              style={{ background: "var(--pink)" }}
            >
              Download app
            </button>
            <div
              className="pointer-events-none absolute right-0 top-full mt-2 w-36 rounded-xl px-3 py-2 text-center text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                background: "var(--charcoal)",
                color: "#fff",
              }}
            >
              Coming winter 2026
            </div>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 sm:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span
            className="block h-0.5 w-6 transition-all duration-200"
            style={{
              background: "var(--charcoal)",
              transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
            }}
          />
          <span
            className="block h-0.5 w-6 transition-all duration-200"
            style={{
              background: "var(--charcoal)",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className="block h-0.5 w-6 transition-all duration-200"
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
            className="py-3 text-sm"
            style={linkStyle("/how-it-works")}
            onClick={() => setMobileOpen(false)}
          >
            How it works
          </Link>
          <Link
            href="/for-salons"
            className="py-3 text-sm"
            style={linkStyle("/for-salons")}
            onClick={() => setMobileOpen(false)}
          >
            For salons
          </Link>
          <Link
            href="/salon/login"
            className="py-3 text-sm"
            style={linkStyle("/salon")}
            onClick={() => setMobileOpen(false)}
          >
            Salon login
          </Link>
          <button
            disabled
            className="mt-2 rounded-full py-3 text-sm font-semibold text-white opacity-50 cursor-not-allowed"
            style={{ background: "var(--pink)" }}
          >
            Download app — coming winter 2026
          </button>
        </div>
      )}
    </nav>
  );
}
