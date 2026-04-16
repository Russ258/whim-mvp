"use client";

import Link from "next/link";
import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const benefits = [
  {
    icon: "✦",
    title: "You control everything",
    desc: "Set your own discount, choose which slots to offer, and post only when you want. Nothing is ever automatic.",
  },
  {
    icon: "✓",
    title: "Real bookings, not leads",
    desc: "Customers show up with a voucher. No time-wasters, no cold inquiries — just confirmed appointments.",
  },
  {
    icon: "$",
    title: "No subscription",
    desc: "Free to join. We charge a flat $10 per redeemed booking — only when a customer walks through your door.",
  },
  {
    icon: "◎",
    title: "Simple redemption",
    desc: "Open whim.au/redeem on any device, enter the code, tap confirm. 10 seconds. No app, no hardware.",
  },
  {
    icon: "↗",
    title: "Reach new clients",
    desc: "Whim brings in people who've never been to your salon — and they discover you because of a great experience.",
  },
  {
    icon: "⚡",
    title: "No integration needed",
    desc: "Whim works alongside your existing booking system. No software changes, no IT required.",
  },
];

const howItWorksSteps = [
  { step: "01", title: "Sign up", desc: "2-minute form. We review and set you up within 24 hours." },
  { step: "02", title: "Post quiet slots", desc: "Log into your dashboard, choose tier + discount, go live instantly." },
  { step: "03", title: "Customers book", desc: "You get notified immediately — name, tier, time. Just be ready." },
  { step: "04", title: "Scan QR, done", desc: "Open whim.au/redeem, confirm the code, apply discount at your POS." },
];

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
  fontFamily: "var(--font-inter)",
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

export default function ForSalonsPage() {
  const [form, setForm] = useState({
    salonName: "",
    contactName: "",
    email: "",
    phone: "",
    suburb: "",
    chairs: "",
    bookingSoftware: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
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
        body: JSON.stringify({
          salonName: form.salonName,
          contactName: form.contactName,
          email: form.email,
          phone: form.phone,
          address: form.suburb,
          chairs: form.chairs,
          bookingSoftware: form.bookingSoftware,
          notes: form.notes,
        }),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-enter min-h-screen" style={{ background: "var(--surface)", color: "var(--charcoal)" }}>
      <Nav />

      {/* ─── Hero ─── */}
      <section
        className="flex flex-col items-center justify-center px-6 py-32 text-center"
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
          className="mx-auto mb-6 max-w-3xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)", letterSpacing: "-0.02em" }}
        >
          Fill your quiet hours.
          <br />
          <span style={{ color: "var(--pink)" }}>Get paid.</span>
        </h1>
        <p
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          Whim sends paying customers to your salon during your slowest hours. No upfront cost. No subscription. Just bookings.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#signup"
            className="rounded-full px-8 py-4 text-base font-bold text-white transition-all hover:opacity-90"
            style={{ background: "var(--pink)", boxShadow: "0 4px 18px rgba(232,130,154,0.4)" }}
          >
            Sign up your salon
          </a>
          <Link
            href="/how-it-works"
            className="rounded-full border px-8 py-4 text-base font-semibold transition-all hover:opacity-80"
            style={{ borderColor: "var(--pink)", color: "var(--pink)" }}
          >
            See how it works →
          </Link>
        </div>
      </section>

      {/* ─── Stats strip ─── */}
      <div
        className="px-6 py-10"
        style={{ background: "var(--charcoal)" }}
      >
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: "2 min", label: "to sign up" },
            { value: "$0", label: "upfront cost" },
            { value: "40%", label: "max discount you set" },
            { value: "24 hrs", label: "to get your first listing live" },
          ].map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 text-center">
              <span
                className="text-4xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--pink)" }}
              >
                {value}
              </span>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── How it works ─── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--pink)" }}
          >
            Simple process
          </p>
          <h2
            className="mb-14 text-center text-4xl font-bold sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            How it works for salons
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorksSteps.map(({ step, title, desc }) => (
              <div
                key={step}
                className="card flex flex-col gap-3 p-6"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <span
                  className="text-5xl font-bold leading-none"
                  style={{ color: "rgba(232,130,154,0.18)", fontFamily: "var(--font-playfair)" }}
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
          <div className="mt-8 text-center">
            <Link
              href="/how-it-works"
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--pink)" }}
            >
              See the full walkthrough →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="px-6 py-20" style={{ background: "var(--surface-warm)" }}>
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--pink)" }}
          >
            Why salons love Whim
          </p>
          <h2
            className="mb-12 text-center text-4xl font-bold sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            Everything on your terms
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex flex-col gap-3 rounded-3xl p-7"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  border: "1px solid rgba(232,130,154,0.12)",
                  boxShadow: "0 4px 20px rgba(61,44,53,0.06)",
                }}
              >
                <span className="text-3xl">{icon}</span>
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

      {/* ─── Testimonial ─── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <div
            className="rounded-3xl p-10"
            style={{
              background: "linear-gradient(135deg, rgba(232,130,154,0.08) 0%, rgba(201,179,217,0.12) 100%)",
              border: "1.5px solid rgba(232,130,154,0.2)",
            }}
          >
            <p
              className="mb-6 text-xl font-bold italic leading-relaxed"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
            >
              &ldquo;We filled 3 slots we would have lost last Tuesday. Took 5 minutes to set up.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #e8829a, #c9b3d9)" }}
              >
                SS
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
                  Strand Studio
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  Sydney — Whim partner
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Signup form ─── */}
      <section
        id="signup"
        className="px-6 py-24"
        style={{ background: "linear-gradient(160deg, #fce4ec 0%, #fdf0f5 100%)" }}
      >
        <div className="mx-auto max-w-xl">
          <p
            className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--pink)" }}
          >
            Get listed
          </p>
          <h2
            className="mb-3 text-center text-4xl font-bold sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            Sign up your salon
          </h2>
          <p className="mb-10 text-center text-base" style={{ color: "var(--muted)" }}>
            Takes 2 minutes. We&apos;ll be in touch within 24 hours.
          </p>

          {success ? (
            <div
              className="rounded-3xl p-12 text-center"
              style={{
                background: "rgba(255,255,255,0.97)",
                border: "1.5px solid rgba(232,130,154,0.2)",
                boxShadow: "0 8px 40px rgba(61,44,53,0.08)",
              }}
            >
              {/* Checkmark */}
              <div
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full text-3xl"
                style={{
                  background: "linear-gradient(135deg, #e8829a, #c9b3d9)",
                  boxShadow: "0 6px 24px rgba(232,130,154,0.4)",
                }}
              >

              </div>
              <h3
                className="mb-3 text-3xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
              >
                You&apos;re on the list!
              </h3>
              <p className="mb-6 text-base leading-relaxed" style={{ color: "var(--muted)" }}>
                We&apos;ll review your application and be in touch within 24 hours. In the meantime,
                check out how it works for salons.
              </p>
              <Link
                href="/how-it-works"
                className="inline-flex rounded-full px-8 py-3 text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.35)" }}
              >
                See how it works →
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 rounded-3xl p-8 sm:p-10"
              style={{
                background: "rgba(255,255,255,0.97)",
                border: "1.5px solid rgba(232,130,154,0.15)",
                boxShadow: "0 8px 40px rgba(61,44,53,0.08)",
              }}
            >
              {/* Salon name */}
              <div>
                <label htmlFor="salonName" style={labelStyle}>
                  Salon name <span style={{ color: "var(--pink)" }}>*</span>
                </label>
                <input
                  id="salonName"
                  name="salonName"
                  type="text"
                  required
                  placeholder="e.g. Strand Studio"
                  value={form.salonName}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Contact name */}
              <div>
                <label htmlFor="contactName" style={labelStyle}>
                  Your name <span style={{ color: "var(--pink)" }}>*</span>
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

              {/* Email + Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" style={labelStyle}>
                    Email <span style={{ color: "var(--pink)" }}>*</span>
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
                    Phone <span style={{ color: "var(--pink)" }}>*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+61 4xx xxx xxx"
                    value={form.phone}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Suburb */}
              <div>
                <label htmlFor="suburb" style={labelStyle}>
                  Suburb / area <span style={{ color: "var(--pink)" }}>*</span>
                </label>
                <input
                  id="suburb"
                  name="suburb"
                  type="text"
                  required
                  placeholder="e.g. Newtown, Surry Hills, Paddington"
                  value={form.suburb}
                  onChange={handleChange}
                  style={inputStyle}
                />
              </div>

              {/* Chairs + booking software */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="chairs" style={labelStyle}>
                    How many chairs?
                  </label>
                  <select
                    id="chairs"
                    name="chairs"
                    value={form.chairs}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select…</option>
                    <option value="1-2">1–2</option>
                    <option value="3-5">3–5</option>
                    <option value="6-10">6–10</option>
                    <option value="10+">10+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bookingSoftware" style={labelStyle}>
                    Booking software
                  </label>
                  <select
                    id="bookingSoftware"
                    name="bookingSoftware"
                    value={form.bookingSoftware}
                    onChange={handleChange}
                    style={{ ...inputStyle, cursor: "pointer" }}
                  >
                    <option value="">Select…</option>
                    <option value="Fresha">Fresha</option>
                    <option value="Timely">Timely</option>
                    <option value="Shortcuts">Shortcuts</option>
                    <option value="Kitomba">Kitomba</option>
                    <option value="Mindbody">Mindbody</option>
                    <option value="Paper/manual">Paper / manual</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" style={labelStyle}>
                  Tell us about your salon (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Type of services, team size, anything you'd like us to know..."
                  value={form.notes}
                  onChange={handleChange}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {error && (
                <p
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{ background: "rgba(232,130,154,0.1)", color: "var(--pink)" }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full py-4 text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.35)", cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Sending…" : "Submit application →"}
              </button>

              <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
                No commitment required. We&apos;ll reach out within 24 hours to get you set up.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
