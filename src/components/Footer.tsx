import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="px-6 py-14"
      style={{
        background: "linear-gradient(160deg, #fce4ec 0%, #fdf0f5 100%)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--pink)" }}
            >
              Whim
            </span>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Last-minute hair, on your terms.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm" style={{ color: "var(--muted)" }}>
            <Link href="/how-it-works" className="transition-opacity hover:opacity-70 hover:underline">
              How it works
            </Link>
            <Link href="/for-salons" className="transition-opacity hover:opacity-70 hover:underline">
              For Salons
            </Link>
            <Link href="/redeem" className="transition-opacity hover:opacity-70 hover:underline">
              Redeem voucher
            </Link>
            <a href="mailto:hello@whim.au" className="transition-opacity hover:opacity-70 hover:underline">
              hello@whim.au
            </a>
          </div>
        </div>

        {/* Bottom line */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 pt-6 text-xs"
          style={{ borderTop: "1px solid var(--border)", color: "var(--muted-light)" }}
        >
          <span>© 2026 Whim. Sydney, Australia.</span>
          <span>Made with love for spontaneous people.</span>
        </div>
      </div>
    </footer>
  );
}
