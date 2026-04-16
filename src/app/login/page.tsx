import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROLE_COOKIE } from "@/lib/auth";
import Link from "next/link";

async function adminLogin(formData: FormData) {
  "use server";
  const passcode = (formData.get("passcode") as string) ?? "";
  const expected = process.env.ADMIN_PASSCODE ?? "admin-daypass";

  if (passcode !== expected) {
    redirect("/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(ROLE_COOKIE, "admin", {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/admin");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4"
      style={{ background: "var(--surface)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/">
            <span
              className="text-4xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--pink)" }}
            >
              Whim
            </span>
          </Link>
          <p
            className="mt-2 text-xs font-semibold uppercase tracking-[0.35em]"
            style={{ color: "var(--muted)" }}
          >
            Admin access
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(232,130,154,0.15)",
            boxShadow: "0 8px 40px rgba(61,44,53,0.08)",
          }}
        >
          <h1
            className="mb-1 text-2xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            Welcome back
          </h1>
          <p className="mb-6 text-sm" style={{ color: "var(--muted)" }}>
            Enter your admin passcode to continue.
          </p>

          {hasError && (
            <div
              className="mb-4 rounded-2xl px-4 py-3 text-sm font-medium"
              style={{
                background: "rgba(192,57,43,0.08)",
                color: "#c0392b",
                border: "1px solid rgba(192,57,43,0.15)",
              }}
            >
              Incorrect passcode. Try again.
            </div>
          )}

          <form action={adminLogin} className="flex flex-col gap-4">
            <input
              name="passcode"
              type="password"
              placeholder="Passcode"
              autoComplete="current-password"
              required
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition-all"
              style={{
                borderColor: hasError
                  ? "rgba(192,57,43,0.4)"
                  : "rgba(232,130,154,0.2)",
                background: "rgba(253,240,245,0.4)",
                color: "var(--charcoal)",
              }}
            />
            <button
              type="submit"
              className="w-full rounded-full py-3 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{
                background: "var(--pink)",
                boxShadow: "0 4px 14px rgba(232,130,154,0.35)",
              }}
            >
              Sign in
            </button>
          </form>
        </div>

        {/* Salon link */}
        <p className="mt-6 text-center text-sm" style={{ color: "var(--muted)" }}>
          Are you a salon partner?{" "}
          <Link
            href="/salon/login"
            className="font-semibold transition-opacity hover:opacity-70"
            style={{ color: "var(--pink)" }}
          >
            Salon login
          </Link>
        </p>
      </div>
    </main>
  );
}
