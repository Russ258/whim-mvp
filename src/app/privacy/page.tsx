import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
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
            Privacy Policy
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
            Whim is currently in pre-launch. A full Privacy Policy compliant with the Australian
            Privacy Act 1988 will be published prior to the public launch in winter 2026.
          </p>
          <p className="mt-4" style={{ color: "var(--muted)" }}>
            Questions? Email us at{" "}
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
              1. What we collect
            </h2>
            <p style={{ color: "var(--muted)" }}>
              We collect information you provide directly, including:
            </p>
            <ul className="mt-3 space-y-1.5 pl-5" style={{ color: "var(--muted)", listStyleType: "disc" }}>
              <li>Name and email address when you join the waitlist or make a booking</li>
              <li>Salon name and contact details when you apply as a partner salon</li>
              <li>Usage data (pages visited, actions taken) via anonymous analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              2. How we use it
            </h2>
            <ul className="mt-3 space-y-1.5 pl-5" style={{ color: "var(--muted)", listStyleType: "disc" }}>
              <li>To send booking confirmations and reminders</li>
              <li>To notify you when Whim launches (waitlist members)</li>
              <li>To operate the platform and support salon partners</li>
              <li>To improve the product — we never sell your data</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              3. Third-party services
            </h2>
            <p style={{ color: "var(--muted)" }}>
              We use the following third-party services to operate Whim:
            </p>
            <ul className="mt-3 space-y-1.5 pl-5" style={{ color: "var(--muted)", listStyleType: "disc" }}>
              <li><strong style={{ color: "var(--charcoal)" }}>Resend</strong> — transactional email delivery</li>
              <li><strong style={{ color: "var(--charcoal)" }}>Neon</strong> — database hosting (hosted in the US)</li>
              <li><strong style={{ color: "var(--charcoal)" }}>Vercel</strong> — web hosting</li>
            </ul>
            <p className="mt-3" style={{ color: "var(--muted)" }}>
              Each provider has their own privacy policy. We do not share your data with any other
              third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              4. Data retention
            </h2>
            <p style={{ color: "var(--muted)" }}>
              We retain your data for as long as necessary to provide the service. You can request
              deletion of your personal data at any time by emailing{" "}
              <a
                href="mailto:hello@whim.au"
                className="font-semibold underline underline-offset-2"
                style={{ color: "var(--pink)" }}
              >
                hello@whim.au
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              5. Your rights
            </h2>
            <p style={{ color: "var(--muted)" }}>
              Under the Australian Privacy Act 1988, you have the right to access, correct, or
              request deletion of your personal information. To exercise these rights, contact us
              at{" "}
              <a
                href="mailto:hello@whim.au"
                className="font-semibold underline underline-offset-2"
                style={{ color: "var(--pink)" }}
              >
                hello@whim.au
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              6. Cookies
            </h2>
            <p style={{ color: "var(--muted)" }}>
              Whim uses cookies solely for authentication (keeping you logged in as a salon partner
              or admin). We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              7. Contact
            </h2>
            <p style={{ color: "var(--muted)" }}>
              Privacy questions or requests:{" "}
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
