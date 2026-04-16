"use client";

import Link from "next/link";
import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

/* ─── Customer steps ─── */
const customerSteps = [
  {
    number: "01",
    icon: "",
    title: "Browse today's deals",
    bullets: [
      "Open Whim, see all available same-day slots from top Sydney salons",
      "Filter by time (next hour, next 2 hours, today), sort by discount or distance",
      "Each slot shows the salon, tier (Quick / Full / Premium), discount %, and time",
    ],
  },
  {
    number: "02",
    icon: "",
    title: "Pick your slot",
    bullets: [
      "Tap any deal to see the salon details and available time",
      "Three tiers: Quick (up to 45 min — trim, blowout, toner), Full (up to 90 min — cut + colour, highlights), Premium (up to 2.5 hrs — balayage, treatments)",
      "No need to specify the exact service — just tell the stylist what you're after when you arrive",
    ],
  },
  {
    number: "03",
    icon: "",
    title: "Book instantly",
    bullets: [
      "Enter your name and email — that's it. No credit card required.",
      'Add a note for the stylist: \u201cI\u2019m thinking a trim and toner\u201d (optional)',
      "Tap Confirm — your slot is reserved immediately",
    ],
  },
  {
    number: "04",
    icon: "",
    title: "Get your voucher",
    bullets: [
      "Instantly receive a unique QR voucher code (e.g. WHM-4K9XZ)",
      "It's in the app and sent to your email from bookings@whim.au",
      "Your discount is locked in — it can't be taken by anyone else",
    ],
  },
  {
    number: "05",
    icon: "",
    title: "Show up & enjoy",
    bullets: [
      "Arrive at the salon, open your Whim voucher",
      "Show the QR code to your stylist — they scan it to confirm",
      "They apply your discount and you pay the discounted price directly at the salon (cash or card)",
      "No hidden fees, no subscription — just a great deal",
    ],
  },
];

/* ─── Customer FAQs ─── */
const customerFAQs = [
  {
    q: "Do I need a credit card?",
    a: "No. Payment is at the salon on the day, in cash or card. We never ask for your card details.",
  },
  {
    q: "Can I cancel?",
    a: "Slots are last-minute so we ask you to honour your booking. If something comes up, contact the salon directly as soon as possible.",
  },
  {
    q: "What if I want a specific service?",
    a: "Use the notes field to tell your stylist what you're after. They'll confirm what's possible within your appointment tier when you arrive.",
  },
  {
    q: "How fresh are the deals?",
    a: "Very. Slots expire — they're real same-day availability posted by salons today, not old or recycled listings.",
  },
];

/* ─── Salon steps ─── */
const salonSteps = [
  {
    number: "01",
    icon: "",
    title: "Sign up as a partner",
    bullets: [
      "Fill in your salon details on our partner page — takes 2 minutes",
      "Our team reviews and sets you up within 24 hours",
      "You get access to your salon dashboard at whim.au/salon",
    ],
  },
  {
    number: "02",
    icon: "",
    title: "Post your quiet slots",
    bullets: [
      "When you have a gap in your calendar, log into your dashboard",
      "Choose the appointment tier (Quick / Full / Premium) and set your discount",
      "You're in full control — post as many or as few slots as you like, whenever you want",
      "Slots go live on the Whim app immediately",
    ],
  },
  {
    number: "03",
    icon: "",
    title: "Customer books instantly",
    bullets: [
      "A nearby customer sees your slot and books in seconds",
      "You get an email + SMS notification immediately with their name, tier, and time",
      "No action needed — just be ready to welcome them",
    ],
  },
  {
    number: "04",
    icon: "",
    title: "Redeem the voucher",
    bullets: [
      "Customer arrives and shows their Whim QR code",
      "Open whim.au/redeem on any device, enter their code",
      "See their name, discount %, appointment tier, and any notes",
      'Tap \u201cMark as redeemed\u201d \u2014 done. Apply the discount at your POS as normal.',
    ],
  },
  {
    number: "05",
    icon: "",
    title: "We handle the rest",
    bullets: [
      "Whim charges a flat $10 per redeemed booking — invoiced monthly",
      "No upfront costs, no subscription — you only pay when you get a customer",
      "Track all your Whim bookings and revenue in your dashboard",
    ],
  },
];

/* ─── Salon FAQs ─── */
const salonFAQs = [
  {
    q: "How much does it cost?",
    a: "No upfront cost. We charge a flat $10 per redeemed booking — you only pay when a customer actually walks through your door.",
  },
  {
    q: "Do I need special equipment?",
    a: "Just a phone or tablet with a browser. No app, no hardware, no integrations required.",
  },
  {
    q: "Can I control which slots I offer?",
    a: "Yes, completely. You post slots only when you want to, for the tier and discount you choose. Nothing is automatic.",
  },
  {
    q: "What if a customer doesn't show?",
    a: "We're working on a formal no-show policy. For now, please contact hello@whim.au and we'll help resolve it.",
  },
  {
    q: "Can I set different discounts for different appointments?",
    a: "Yes. You choose the discount percentage per slot when you post it.",
  },
];

/* ─── FAQ Accordion item ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.85)",
        border: "1px solid rgba(232,130,154,0.15)",
        boxShadow: "0 2px 12px rgba(61,44,53,0.06)",
      }}
    >
      <button
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="text-base font-semibold" style={{ color: "var(--charcoal)" }}>
          {q}
        </span>
        <span
          className="shrink-0 text-xl font-light transition-transform"
          style={{
            color: "var(--pink)",
            transform: open ? "rotate(45deg)" : "none",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          className="px-6 pb-5 text-sm leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          {a}
        </div>
      )}
    </div>
  );
}

/* ─── Step card ─── */
function StepCard({
  step,
  isLast,
}: {
  step: (typeof customerSteps)[number];
  isLast: boolean;
}) {
  return (
    <div className="relative flex flex-col gap-0 sm:flex-row">
      {/* Number + connector line */}
      <div className="flex shrink-0 flex-col items-center sm:w-20">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold"
          style={{
            background: "linear-gradient(135deg, #e8829a 0%, #c9b3d9 100%)",
            color: "#fff",
            fontFamily: "var(--font-playfair)",
            boxShadow: "0 4px 16px rgba(232,130,154,0.35)",
          }}
        >
          {step.number}
        </div>
        {!isLast && (
          <div
            className="mt-2 w-0.5 flex-1"
            style={{ background: "rgba(232,130,154,0.25)", minHeight: 48 }}
          />
        )}
      </div>

      {/* Content */}
      <div
        className="mb-10 ml-0 flex flex-1 flex-col gap-4 rounded-2xl p-6 sm:ml-6"
        style={{
          background: "rgba(255,255,255,0.9)",
          border: "1px solid rgba(232,130,154,0.12)",
          boxShadow: "0 4px 24px rgba(61,44,53,0.07)",
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{step.icon}</span>
          <h3 className="text-xl font-bold" style={{ color: "var(--charcoal)", fontFamily: "var(--font-playfair)" }}>
            {step.title}
          </h3>
        </div>
        <ul className="flex flex-col gap-2">
          {step.bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              <span
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: "var(--pink)" }}
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  const [tab, setTab] = useState<"customers" | "salons">("customers");

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)", color: "var(--charcoal)" }}>
      <Nav />

      {/* ─── Hero ─── */}
      <section
        className="px-6 py-20 text-center"
        style={{ background: "linear-gradient(160deg, #fce4ec 0%, #fdf0f5 60%, #ede7f6 100%)" }}
      >
        <p
          className="mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--pink)" }}
        >
          The full picture
        </p>
        <h1
          className="mx-auto mb-4 max-w-2xl text-5xl font-bold leading-tight sm:text-6xl"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
        >
          How Whim works
        </h1>
        <p className="mx-auto max-w-lg text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
          {tab === "customers"
            ? "Last-minute hair has never been this easy."
            : "Turn quiet hours into paying appointments."}
        </p>
      </section>

      {/* ─── Tabs ─── */}
      <div className="sticky top-[65px] z-40 flex justify-center px-6 py-4" style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
        <div
          className="inline-flex rounded-full p-1"
          style={{ background: "rgba(232,130,154,0.1)", border: "1px solid rgba(232,130,154,0.2)" }}
        >
          {(["customers", "salons"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="rounded-full px-6 py-2.5 text-sm font-semibold capitalize transition-all"
              style={
                tab === t
                  ? { background: "var(--pink)", color: "#fff", boxShadow: "0 2px 10px rgba(232,130,154,0.35)" }
                  : { color: "var(--muted)", background: "transparent" }
              }
            >
              {t === "customers" ? "For Customers" : "For Salons"}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab content ─── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          {/* Steps */}
          <div className="mb-20">
            {(tab === "customers" ? customerSteps : salonSteps).map((step, i, arr) => (
              <StepCard key={step.number} step={step} isLast={i === arr.length - 1} />
            ))}
          </div>

          {/* FAQ */}
          <div>
            <h2
              className="mb-8 text-3xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
            >
              Common questions
            </h2>
            <div className="flex flex-col gap-3">
              {(tab === "customers" ? customerFAQs : salonFAQs).map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="mt-16 rounded-3xl p-10 text-center"
            style={{
              background: "linear-gradient(135deg, #e8829a 0%, #c9b3d9 100%)",
            }}
          >
            {tab === "customers" ? (
              <>
                <h3
                  className="mb-3 text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Ready to book?
                </h3>
                <p className="mb-6 text-white/80">Download the app when it launches — launching Summer 2026.</p>
                <button
                  disabled
                  className="cursor-not-allowed rounded-full bg-white px-8 py-3 text-base font-bold opacity-70"
                  style={{ color: "var(--pink)" }}
                >
                  Download the app (coming soon)
                </button>
              </>
            ) : (
              <>
                <h3
                  className="mb-3 text-2xl font-bold text-white"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Ready to fill your quiet hours?
                </h3>
                <p className="mb-6 text-white/80">Sign up in 2 minutes. No upfront cost. No subscription.</p>
                <Link
                  href="/for-salons"
                  className="inline-flex rounded-full bg-white px-8 py-3 text-base font-bold transition-all hover:opacity-90"
                  style={{ color: "var(--pink)" }}
                >
                  Become a partner →
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
