"use client";

import { useState } from "react";

type Result =
  | { ok: true; earlyAccess: true; promoCode: string; position: number; alreadyJoined?: boolean }
  | { ok: true; earlyAccess: false; position: number; alreadyJoined?: boolean }
  | null;

export default function WaitlistForm({ initialCount }: { initialCount: number }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [count, setCount] = useState(initialCount);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.ok) {
      setResult(data);
      if (!data.alreadyJoined) setCount((c) => c + 1);
    }
  }

  if (result) {
    return (
      <div className="flex flex-col items-center gap-4">
        {result.earlyAccess ? (
          <>
            <div
              className="rounded-3xl px-8 py-6 text-center"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(232,130,154,0.2)",
                boxShadow: "0 8px 40px rgba(61,44,53,0.1)",
                maxWidth: 400,
              }}
            >
              <p
                className="mb-1 text-sm font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--pink)" }}
              >
                {result.alreadyJoined ? "Already signed up" : "You're in"}
              </p>
              <p
                className="mb-4 text-2xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
              >
                You're a founding member
              </p>
              <div
                className="mb-4 rounded-2xl px-6 py-4"
                style={{ background: "rgba(232,130,154,0.08)", border: "1px solid rgba(232,130,154,0.2)" }}
              >
                <p
                  className="text-3xl font-black tracking-[0.15em]"
                  style={{ color: "var(--pink)" }}
                >
                  {result.promoCode}
                </p>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                Skip the queue. First access to new salons and the best slots.
                <br />
                Check your email — we sent your founding member code there too.
              </p>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
              {count.toLocaleString()} people on the waitlist
            </p>
          </>
        ) : (
          <>
            <div
              className="rounded-3xl px-8 py-6 text-center"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(232,130,154,0.2)",
                boxShadow: "0 8px 40px rgba(61,44,53,0.1)",
                maxWidth: 400,
              }}
            >
              <p
                className="mb-2 text-2xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
              >
                You're on the list.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                We'll email you the moment Whim launches in Sydney.
              </p>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--muted)" }}>
              {count.toLocaleString()} people on the waitlist
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Early access incentive */}
      <div
        className="mb-2 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
        style={{
          background: "rgba(255,255,255,0.9)",
          color: "var(--charcoal)",
          border: "1px solid rgba(232,130,154,0.25)",
          boxShadow: "0 2px 8px rgba(61,44,53,0.06)",
        }}
      >
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ background: "var(--pink)" }}
        />
        First 100 members get founding member status
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 rounded-full border px-5 py-3.5 text-sm outline-none transition-all"
          style={{
            borderColor: "rgba(232,130,154,0.25)",
            background: "rgba(255,255,255,0.95)",
            color: "var(--charcoal)",
            boxShadow: "0 2px 12px rgba(61,44,53,0.06)",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full px-7 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
          style={{
            background: "var(--pink)",
            boxShadow: "0 4px 18px rgba(232,130,154,0.45)",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "Joining…" : "Join waitlist"}
        </button>
      </form>

      {/* Counter */}
      {count > 0 && (
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          <span className="font-semibold" style={{ color: "var(--charcoal)" }}>
            {count.toLocaleString()}
          </span>{" "}
          people already signed up
        </p>
      )}
    </div>
  );
}
