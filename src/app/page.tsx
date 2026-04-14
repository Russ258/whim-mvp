import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--surface)", color: "var(--charcoal)" }}>
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(253,240,245,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Link href="/" className="font-display text-3xl font-bold" style={{ color: "var(--pink)", fontFamily: "var(--font-playfair)" }}>
          Whim
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/for-salons"
            className="hidden text-sm font-medium sm:block"
            style={{ color: "var(--muted)" }}
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

      {/* Hero */}
      <section
        className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-24 text-center"
        style={{
          background: "linear-gradient(160deg, #fce4ec 0%, #fdf0f5 45%, #ede7f6 100%)",
        }}
      >
        <p
          className="mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--pink)" }}
        >
          Sydney&apos;s last-minute beauty app
        </p>
        <h1
          className="mx-auto mb-6 max-w-3xl text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
        >
          Last-minute hair,
          <br />
          on your terms.
        </h1>
        <p
          className="mx-auto mb-10 max-w-xl text-lg leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          Whim connects you with Sydney&apos;s best salons offering same-day discounts on empty appointment slots.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            disabled
            className="rounded-full px-8 py-4 text-base font-semibold opacity-60 cursor-not-allowed"
            style={{ background: "var(--pink)", color: "#fff", boxShadow: "0 4px 14px rgba(232,130,154,0.35)" }}
          >
            Download the App
          </button>
          <Link
            href="/for-salons"
            className="rounded-full border px-8 py-4 text-base font-semibold transition-all hover:opacity-80"
            style={{ borderColor: "var(--pink)", color: "var(--pink)" }}
          >
            For Salons →
          </Link>
        </div>

        {/* Phone mockup */}
        <div className="mt-16 flex justify-center">
          <div
            className="relative flex flex-col items-center justify-center overflow-hidden"
            style={{
              width: 220,
              height: 440,
              borderRadius: 40,
              background: "linear-gradient(160deg, #f9c0ce 0%, #e8829a 40%, #c9b3d9 100%)",
              boxShadow: "0 32px 80px rgba(232,130,154,0.35), 0 0 0 6px rgba(255,255,255,0.5)",
              border: "3px solid rgba(255,255,255,0.6)",
            }}
          >
            {/* Camera notch */}
            <div
              className="absolute top-5"
              style={{ width: 80, height: 22, background: "rgba(61,44,53,0.15)", borderRadius: 20 }}
            />
            <div className="flex flex-col items-center gap-3 px-6 text-center">
              <div
                className="text-4xl font-bold"
                style={{ fontFamily: "var(--font-playfair)", color: "#fff" }}
              >
                Whim
              </div>
              <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.85)" }}>
                Coming soon to
              </p>
              <div
                className="rounded-full px-4 py-2 text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.25)", color: "#fff", backdropFilter: "blur(8px)" }}
              >
                App Store &amp; Google Play
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <p
            className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--pink)" }}
          >
            Simple by design
          </p>
          <h2
            className="mb-14 text-center text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            How it works
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse last-minute slots",
                desc: "Discover same-day openings from Sydney's top salons — all at a discount.",
              },
              {
                step: "02",
                title: "Book instantly",
                desc: "Reserve your slot in seconds. No card required, no hidden fees.",
              },
              {
                step: "03",
                title: "Show your QR code",
                desc: "Arrive at the salon, show your QR code, and enjoy your discount.",
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
        </div>
      </section>

      {/* Why Whim */}
      <section
        className="px-6 py-20"
        style={{ background: "var(--surface-warm)" }}
      >
        <div className="mx-auto max-w-4xl">
          <p
            className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--pink)" }}
          >
            Why Whim
          </p>
          <h2
            className="mb-12 text-center text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            Made for spontaneous you
          </h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: "✦", label: "Up to 40% off", sub: "Real discounts on premium salons" },
              { icon: "⏰", label: "Same-day only", sub: "No advance planning needed" },
              { icon: "◎", label: "No subscription", sub: "Free forever — just book and go" },
            ].map(({ icon, label, sub }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-3 rounded-3xl p-8 text-center"
                style={{
                  background: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(232,130,154,0.15)",
                  boxShadow: "0 4px 20px rgba(61,44,53,0.06)",
                }}
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
                  style={{ background: "var(--pink-muted)", color: "var(--pink)" }}
                >
                  {icon}
                </span>
                <p className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
                  {label}
                </p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salon CTA banner */}
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
          <p className="mb-10 text-lg text-white/85">
            Fill your empty slots and reach new clients — no setup fee, no subscription.
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
            Join as a salon →
          </Link>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}
