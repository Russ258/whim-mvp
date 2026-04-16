import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "./WaitlistForm";
import { prisma } from "@/lib/prisma";

const dealCards = [
  { salon: "Strand Studio", discount: "30% off", time: "Today 2:00 pm", tier: "Full", area: "Newtown" },
  { salon: "Blush & Co.", discount: "25% off", time: "Today 3:30 pm", tier: "Quick", area: "Surry Hills" },
  { salon: "Atelier Noir", discount: "40% off", time: "Today 5:00 pm", tier: "Premium", area: "Paddington" },
];

const tierColors: Record<string, string> = {
  Quick: "#9dd4c8",
  Full: "#c9b3d9",
  Premium: "#e8829a",
};

export default async function LandingPage() {
  const waitlistCount = await prisma.waitlistEntry.count();

  return (
    <div className="min-h-screen" style={{ background: "var(--surface)", color: "var(--charcoal)" }}>
      <Nav />

      {/* ─── Hero ─── */}
      <section
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
        style={{ background: "var(--surface)" }}
      >
        {/* Animated gradient orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="hero-orb-1 absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(232,130,154,0.28) 0%, transparent 70%)",
            }}
          />
          <div
            className="hero-orb-2 absolute -right-32 top-20 h-[500px] w-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(201,179,217,0.25) 0%, transparent 70%)",
            }}
          />
          <div
            className="hero-orb-3 absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(157,212,200,0.2) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Pill tag */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(232,130,154,0.12)",
              color: "var(--pink)",
              border: "1px solid rgba(232,130,154,0.25)",
            }}
          >
            <span
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: "var(--pink)" }}
            />
            Sydney · Hair · Same-day deals
          </div>

          {/* Heading */}
          <h1
            className="mx-auto mb-6 max-w-4xl text-6xl font-bold leading-[1.08] sm:text-7xl lg:text-8xl"
            style={{
              fontFamily: "var(--font-playfair)",
              color: "var(--charcoal)",
              letterSpacing: "-0.02em",
            }}
          >
            Great hair,
            <br />
            <span style={{ color: "var(--pink)" }}>on a whim.</span>
          </h1>

          {/* Subtext */}
          <p
            className="mx-auto mb-10 max-w-lg text-lg leading-relaxed"
            style={{ color: "var(--muted)" }}
          >
            Sydney&apos;s best salons. Last-minute slots. Up to 40% off — launching soon.
          </p>

          {/* Waitlist form */}
          <WaitlistForm initialCount={waitlistCount} />

          {/* Nav links */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <Link
              href="/how-it-works"
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--muted)" }}
            >
              How it works →
            </Link>
            <Link
              href="/for-salons"
              className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--muted)" }}
            >
              For salons →
            </Link>
          </div>

          {/* Deal cards mockup */}
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {dealCards.map((card) => (
              <div
                key={card.salon}
                className="flex flex-col gap-3 rounded-2xl p-5 text-left"
                style={{
                  width: 220,
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 8px 32px rgba(61,44,53,0.1), 0 1px 4px rgba(61,44,53,0.06)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Tier badge */}
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                    style={{ background: tierColors[card.tier] }}
                  >
                    {card.tier}
                  </span>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                    style={{ background: "rgba(232,130,154,0.12)", color: "var(--pink)" }}
                  >
                    {card.discount}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "var(--charcoal)" }}>
                    {card.salon}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {card.area}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: 13, color: "var(--muted)" }}></span>
                  <span className="text-xs font-medium" style={{ color: "var(--charcoal)" }}>
                    {card.time}
                  </span>
                </div>
                <div
                  className="mt-1 rounded-xl py-2 text-center text-xs font-semibold text-white"
                  style={{ background: "var(--pink)" }}
                >
                  Book now
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Social proof strip ─── */}
      <div
        className="overflow-hidden py-4 text-center text-sm font-semibold tracking-widest"
        style={{ background: "var(--pink)", color: "#fff" }}
      >
        <span className="uppercase">
          Launching in Sydney &nbsp;·&nbsp; Early members get 10% off forever &nbsp;·&nbsp; No card needed
        </span>
      </div>

      {/* ─── How it works preview ─── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--pink)" }}
          >
            Simple by design
          </p>
          <h2
            className="mb-14 text-center text-4xl font-bold sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            How it works
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse same-day slots",
                desc: "Discover last-minute openings from top Sydney salons — all at a discount, all expiring today.",
              },
              {
                step: "02",
                title: "Book in seconds, no card needed",
                desc: "Enter your name and email. Tap Confirm. Your slot is reserved in an instant — no credit card required.",
              },
              {
                step: "03",
                title: "Show your QR code, enjoy the discount",
                desc: "Arrive at the salon, show your Whim QR code, and enjoy your discount. Payment is at the salon, on the day.",
              },
            ].map(({ step, title, desc }) => (
              <div
                key={step}
                className="card relative flex flex-col gap-4 p-8"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <span
                  className="text-6xl font-bold leading-none"
                  style={{ color: "var(--pink-muted)", fontFamily: "var(--font-playfair)" }}
                >
                  {step}
                </span>
                <h3 className="text-xl font-semibold" style={{ color: "var(--charcoal)" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/how-it-works"
              className="text-base font-semibold transition-opacity hover:opacity-70"
              style={{ color: "var(--pink)" }}
            >
              See full details →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── On a whim section ─── */}
      <section
        className="px-6 py-28 text-center"
        style={{
          background: "linear-gradient(135deg, #f3e8ff 0%, #fce4ec 50%, #e0f2f1 100%)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <p
            className="mx-auto mb-6 text-4xl font-bold italic leading-snug sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            &ldquo;Because sometimes the best decisions are made on a whim.&rdquo;
          </p>
          <p className="mx-auto max-w-xl text-lg leading-relaxed" style={{ color: "var(--muted)" }}>
            Not every great hair day needs three weeks of planning. Whim is for the spontaneous,
            the last-minute, the&nbsp;<em>why not today?</em> — real discounts on real appointments,
            whenever you decide.
          </p>
        </div>
      </section>

      {/* ─── For salons banner ─── */}
      <section
        className="px-6 py-24 text-center"
        style={{
          background: "linear-gradient(135deg, #e8829a 0%, #c9b3d9 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            Salon partners
          </p>
          <h2
            className="mb-4 text-4xl font-bold text-white sm:text-5xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Are you a salon?
          </h2>
          <p className="mb-10 text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.88)" }}>
            Fill your quiet hours with paying clients. No setup fee, no subscription.
          </p>
          <Link
            href="/for-salons"
            className="inline-flex rounded-full px-10 py-4 text-base font-bold transition-all hover:opacity-90"
            style={{
              background: "#fff",
              color: "var(--pink)",
              boxShadow: "0 8px 30px rgba(61,44,53,0.15)",
            }}
          >
            Join as a salon partner →
          </Link>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes orb-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.05); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, 20px) scale(1.08); }
        }
        @keyframes orb-float-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, -30px) scale(1.04); }
        }
        .hero-orb-1 { animation: orb-float-1 10s ease-in-out infinite; }
        .hero-orb-2 { animation: orb-float-2 13s ease-in-out infinite; }
        .hero-orb-3 { animation: orb-float-3 9s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
