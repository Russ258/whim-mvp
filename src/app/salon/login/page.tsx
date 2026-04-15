"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function SalonLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [verifyingToken, setVerifyingToken] = useState(false);

  // On mount, check for ?token= in URL and auto-verify
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    setVerifyingToken(true);
    fetch(`/api/salon/verify-token?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          router.replace("/salon");
        } else {
          setTokenError(data.error ?? "Invalid or expired link");
          setVerifyingToken(false);
        }
      })
      .catch(() => {
        setTokenError("Something went wrong. Please try again.");
        setVerifyingToken(false);
      });
  }, [searchParams, router]);

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/salon/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      setMagicLinkSent(true);
    } catch {
      // silently fail — always show success for security
      setMagicLinkSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (verifyingToken) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4"
          style={{ borderColor: "var(--pink)", borderTopColor: "transparent" }}
        />
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Verifying your link…
        </p>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-sm rounded-3xl bg-white p-8"
      style={{
        border: "1.5px solid rgba(232,130,154,0.15)",
        boxShadow: "0 8px 40px rgba(61,44,53,0.08)",
      }}
    >
      <h1
        className="mb-2 text-2xl font-bold"
        style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
      >
        Salon login
      </h1>
      <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>
        Enter your salon email and we&apos;ll send you a login link.
      </p>

      {/* Token error state */}
      {tokenError && (
        <div
          className="mb-5 rounded-2xl p-4"
          style={{ background: "rgba(220,50,50,0.06)", border: "1px solid rgba(220,50,50,0.15)" }}
        >
          <p className="text-sm font-semibold" style={{ color: "#c0392b" }}>
            {tokenError}
          </p>
          <p className="mt-1 text-xs" style={{ color: "#a08c96" }}>
            Request a new link below.
          </p>
        </div>
      )}

      {magicLinkSent ? (
        <div
          className="flex flex-col items-center gap-3 rounded-2xl py-8 text-center"
          style={{ background: "rgba(232,130,154,0.06)" }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
            style={{ background: "rgba(232,130,154,0.12)", color: "var(--pink)" }}
          >
            ✉
          </div>
          <p className="text-base font-semibold" style={{ color: "var(--charcoal)" }}>
            Check your email!
          </p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            We sent a login link to <strong>{email}</strong>.
            <br />
            It expires in 7 days.
          </p>
          <button
            onClick={() => { setMagicLinkSent(false); setEmail(""); }}
            className="mt-2 text-xs underline underline-offset-2"
            style={{ color: "var(--muted)" }}
          >
            Use a different email
          </button>
        </div>
      ) : (
        <form onSubmit={handleMagicLink} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--muted)" }}
            >
              Salon email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hello@yoursalon.com.au"
              required
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all"
              style={{
                borderColor: "rgba(232,130,154,0.25)",
                color: "var(--charcoal)",
                background: "rgba(253,240,245,0.5)",
              }}
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{
              background: "var(--pink)",
              boxShadow: "0 4px 14px rgba(232,130,154,0.35)",
            }}
          >
            {loading ? "Sending…" : "Send login link"}
          </button>
        </form>
      )}

      <div className="mt-6 border-t pt-5" style={{ borderColor: "rgba(232,130,154,0.12)" }}>
        <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
          Not a Whim partner yet?{" "}
          <Link
            href="/for-salons"
            className="font-semibold underline underline-offset-2"
            style={{ color: "var(--pink)" }}
          >
            Apply here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SalonLoginPage() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--surface)" }}
    >
      {/* Wordmark */}
      <Link
        href="/"
        className="mb-8 text-4xl font-bold leading-none"
        style={{ fontFamily: "var(--font-playfair)", color: "var(--pink)" }}
      >
        Whim
      </Link>

      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4"
              style={{ borderColor: "var(--pink)", borderTopColor: "transparent" }}
            />
          </div>
        }
      >
        <SalonLoginInner />
      </Suspense>
    </main>
  );
}
