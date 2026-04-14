"use client";

import Link from "next/link";
import { useState } from "react";

function Nav() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
      style={{
        background: "rgba(253,240,245,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <Link
        href="/"
        className="font-bold"
        style={{ fontFamily: "var(--font-playfair)", color: "var(--pink)", fontSize: "1.75rem" }}
      >
        Whim
      </Link>
      <div className="flex items-center gap-6">
        <Link
          href="/for-salons"
          className="hidden text-sm font-medium sm:block"
          style={{ color: "var(--pink)", fontWeight: 600 }}
        >
          For Salons
        </Link>
        <Link
          href="/salon/login"
          className="hidden text-sm font-medium sm:block"
          style={{ color: "var(--charcoal)" }}
        >
          Salon login
        </Link>
        <button
          disabled
          className="rounded-full px-4 py-2 text-sm font-semibold opacity-50 cursor-not-allowed"
          style={{ background: "var(--pink)", color: "#fff" }}
        >
          Download app
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer
      className="px-6 py-10"
      style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <div>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--pink)" }}
          >
            Whim
          </span>
          <span className="ml-3 text-sm" style={{ color: "var(--muted)" }}>
            © 2025
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm" style={{ color: "var(--muted)" }}>
          <a href="mailto:hello@whim.au" className="hover:underline">
            hello@whim.au
          </a>
          <Link href="/for-salons" className="hover:underline">
            For Salons
          </Link>
          <Link href="/redeem" className="hover:underline">
            Redeem
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function ForSalonsPage() {
  const [form, setForm] = useState({
    salonName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/salon-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid var(--border)",
    borderRadius: 12,
    padding: "0.75rem 1rem",
    fontSize: "0.9375rem",
    color: "var(--charcoal)",
    background: "rgba(255,255,255,0.8)",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "var(--muted)",
    marginBottom: "0.4rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)", color: "var(--charcoal)" }}>
      <Nav />

      {/* Hero */}
      <section
        className="flex flex-col items-center justify-center px-6 py-28 text-center"
        style={{
          background: "linear-gradient(160deg, #fce4ec 0%, #fdf0f5 50%, #ede7f6 100%)",
        }}
      >
        <p
          className="mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--pink)" }}
        >
          Salon partners
        </p>
        <h1
          className="mx-auto mb-6 max-w-3xl text-5xl font-bold leading-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
        >
          Partner with Whim
        </h1>
        <p
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          Turn your dead hours into paying appointments. Reach new clients, fill quiet slots,
          and grow your revenue — with zero setup costs or subscription fees.
        </p>
        <a
          href="#signup"
          className="rounded-full px-10 py-4 text-base font-bold text-white transition-all hover:opacity-90"
          style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.4)" }}
        >
          Get started free →
        </a>
      </section>

      {/* How it works for salons */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--pink)" }}
          >
            Simple process
          </p>
          <h2
            className="mb-14 text-center text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            How it works for salons
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { step: "01", title: "Sign up", desc: "Fill out the short form below. We'll get you set up within 24 hours." },
              { step: "02", title: "Post your quiet hours", desc: "Use your dashboard to add last-minute slots whenever you have availability." },
              { step: "03", title: "Customers book & show QR", desc: "Clients discover your slot, book instantly, and arrive with a QR voucher." },
              { step: "04", title: "Redeem & get paid", desc: "Scan the QR at reception to confirm the booking. Revenue goes straight to you." },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="card flex flex-col gap-3 p-6"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <span
                  className="text-5xl font-bold leading-none"
                  style={{ color: "rgba(232,130,154,0.2)", fontFamily: "var(--font-playfair)" }}
                >
                  {step}
                </span>
                <h3 className="text-lg font-semibold" style={{ color: "var(--charcoal)" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="px-6 py-20" style={{ background: "var(--surface-warm)" }}>
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--pink)" }}
          >
            Built for salons
          </p>
          <h2
            className="mb-12 text-center text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            Everything on your terms
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                icon: "◎",
                title: "No upfront cost",
                desc: "Free to join, free to use. We only succeed when you do.",
              },
              {
                icon: "✦",
                title: "You control the discount",
                desc: "Set your own discount percentage — from 10% to 50%. You're always in charge.",
              },
              {
                icon: "↗",
                title: "Real bookings, not leads",
                desc: "Customers commit upfront. No time-wasters, no no-shows from cold inquiries.",
              },
              {
                icon: "⬡",
                title: "Simple QR redemption",
                desc: "One scan at reception confirms the booking. No complicated integrations.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-5 rounded-3xl p-7"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(232,130,154,0.12)",
                  boxShadow: "0 4px 20px rgba(61,44,53,0.06)",
                }}
              >
                <span
                  className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl"
                  style={{ background: "var(--pink-muted)", color: "var(--pink)" }}
                >
                  {icon}
                </span>
                <div>
                  <h3 className="mb-1 text-lg font-semibold" style={{ color: "var(--charcoal)" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup form */}
      <section id="signup" className="px-6 py-24">
        <div className="mx-auto max-w-xl">
          <p
            className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--pink)" }}
          >
            Join the waitlist
          </p>
          <h2
            className="mb-10 text-center text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            Get your salon listed
          </h2>

          {success ? (
            <div
              className="rounded-3xl p-10 text-center"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "1.5px solid rgba(232,130,154,0.2)",
                boxShadow: "0 8px 40px rgba(61,44,53,0.08)",
              }}
            >
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-2xl"
                style={{ background: "var(--pink-muted)", color: "var(--pink)" }}
              >
                ✓
              </div>
              <h3 className="mb-3 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}>
                You&apos;re on the list!
              </h3>
              <p className="text-base" style={{ color: "var(--muted)" }}>
                We&apos;ll be in touch within 24 hours!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 rounded-3xl p-8 sm:p-10"
              style={{
                background: "rgba(255,255,255,0.95)",
                border: "1.5px solid rgba(232,130,154,0.15)",
                boxShadow: "0 8px 40px rgba(61,44,53,0.08)",
              }}
            >
              <div>
                <label htmlFor="salonName" style={labelStyle}>
                  Salon name
                </label>
                <input
                  id="salonName"
                  name="salonName"
                  type="text"
                  required
                  placeholder="e.g. Belle Hair Studio"
                  value={form.salonName}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="contactName" style={labelStyle}>
                  Your name
                </label>
                <input
                  id="contactName"
                  name="contactName"
                  type="text"
                  required
                  placeholder="e.g. Sophie Chen"
                  value={form.contactName}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" style={labelStyle}>
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@salon.com"
                    value={form.email}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="phone" style={labelStyle}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+61 4xx xxx xxx"
                    value={form.phone}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" style={labelStyle}>
                  Suburb / address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="e.g. 42 King St, Newtown NSW 2042"
                  value={form.address}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="notes" style={labelStyle}>
                  Tell us about your salon
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Type of services, team size, anything you'd like us to know..."
                  value={form.notes}
                  onChange={handleChange}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {error && (
                <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "rgba(232,130,154,0.1)", color: "var(--pink)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full py-4 text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.35)" }}
              >
                {loading ? "Sending…" : "Submit application →"}
              </button>

              <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
                No commitment. We&apos;ll reach out within 24 hours to get you set up.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
