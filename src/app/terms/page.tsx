import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="page-enter min-h-screen" style={{ background: "var(--surface)", color: "var(--charcoal)" }}>
      <Nav />

      <main className="mx-auto max-w-3xl px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "var(--pink)" }}
          >
            Legal
          </p>
          <h1
            className="mb-4 text-5xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Last updated: April 2026
          </p>
        </div>

        <div
          className="rounded-3xl p-8 text-sm leading-relaxed"
          style={{
            background: "rgba(232,130,154,0.05)",
            border: "1px solid rgba(232,130,154,0.15)",
          }}
        >
          <p style={{ color: "var(--muted)" }}>
            Whim is currently in pre-launch. Full Terms of Service will be published prior to the
            public launch in winter 2026.
          </p>
          <p className="mt-4" style={{ color: "var(--muted)" }}>
            In the meantime, if you have any questions please contact us at{" "}
            <a
              href="mailto:hello@whim.au"
              className="font-semibold underline underline-offset-2"
              style={{ color: "var(--pink)" }}
            >
              hello@whim.au
            </a>
            .
          </p>
        </div>

        <div className="mt-16 space-y-10" style={{ color: "var(--charcoal)" }}>
          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              1. About Whim
            </h2>
            <p style={{ color: "var(--muted)" }}>
              Whim is a same-day hair booking platform connecting consumers with Sydney hair salons
              that have last-minute availability. Whim is operated by Whim AU Pty Ltd (ABN pending),
              Sydney, Australia.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              2. Bookings &amp; payments
            </h2>
            <p style={{ color: "var(--muted)" }}>
              Whim facilitates the booking of appointments but is not a party to the service
              agreement between you and the salon. Payment for services is made directly to the
              salon on the day of your appointment. Whim does not process or hold payment on
              behalf of consumers.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              3. Cancellations
            </h2>
            <p style={{ color: "var(--muted)" }}>
              Slots are last-minute and may be cancelled by the salon at any time. If a salon
              cancels your booking, you will be notified by email. Whim is not liable for any
              inconvenience caused by a salon cancellation.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              4. Waitlist &amp; promo codes
            </h2>
            <p style={{ color: "var(--muted)" }}>
              By joining the Whim waitlist you agree to receive email communications about our
              launch. Promo codes issued to early waitlist members are personal, non-transferable,
              and subject to change. Whim reserves the right to modify or withdraw promotional
              offers at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              5. Limitation of liability
            </h2>
            <p style={{ color: "var(--muted)" }}>
              To the maximum extent permitted by Australian law, Whim is not liable for any
              indirect, incidental, or consequential damages arising from your use of the platform
              or any service booked through it.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              6. Governing law
            </h2>
            <p style={{ color: "var(--muted)" }}>
              These terms are governed by the laws of New South Wales, Australia. Any disputes
              will be subject to the exclusive jurisdiction of the courts of NSW.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              7. Contact
            </h2>
            <p style={{ color: "var(--muted)" }}>
              Questions about these terms?{" "}
              <a
                href="mailto:hello@whim.au"
                className="font-semibold underline underline-offset-2"
                style={{ color: "var(--pink)" }}
              >
                hello@whim.au
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
