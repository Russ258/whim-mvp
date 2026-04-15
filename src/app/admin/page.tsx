import { createSalonAction } from "@/app/actions/admin";
import { approveSalonApplication, declineSalonApplication } from "@/app/actions/salon-admin";
import { getActiveRole } from "@/lib/auth";
import { getAdminBookings, getSalonApplications, getSalons } from "@/lib/queries";
import { format } from "date-fns";
import Link from "next/link";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  PENDING: { bg: "rgba(255,200,60,0.15)", color: "#c47f00", label: "Pending" },
  APPROVED: { bg: "rgba(90,158,149,0.12)", color: "#5a9e95", label: "Approved" },
  DECLINED: { bg: "rgba(192,57,43,0.1)", color: "#c0392b", label: "Declined" },
};

const TIER_META: Record<string, { color: string; bg: string }> = {
  QUICK: { color: "#5a9e95", bg: "rgba(90,158,149,0.12)" },
  FULL: { color: "#e8829a", bg: "rgba(232,130,154,0.12)" },
  PREMIUM: { color: "#9b7fc8", bg: "rgba(155,127,200,0.12)" },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const role = await getActiveRole();

  if (role !== "admin") {
    return (
      <main
        className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center"
        style={{ color: "var(--charcoal)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
          Restricted
        </p>
        <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}>
          Admin tools locked
        </h1>
        <p style={{ color: "var(--muted)" }}>Use the admin passcode on the login page to proceed.</p>
        <Link
          className="rounded-full px-6 py-3 text-sm font-semibold text-white"
          href="/login"
          style={{ background: "var(--pink)" }}
        >
          Go to login
        </Link>
      </main>
    );
  }

  const params = await searchParams;
  const activeTab = params.tab ?? "applications";

  const [applications, salons, bookings] = await Promise.all([
    getSalonApplications(),
    getSalons(),
    getAdminBookings(),
  ]);

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;

  const tabs = [
    { id: "applications", label: "Applications", badge: pendingCount > 0 ? pendingCount : undefined },
    { id: "salons", label: "Salons" },
    { id: "bookings", label: "Bookings" },
  ];

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8"
      style={{ color: "var(--charcoal)" }}
    >
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em]" style={{ color: "var(--muted)" }}>
            Operations HQ
          </p>
          <h1
            className="text-4xl font-bold"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            Whim Command
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: "var(--muted)", border: "1px solid rgba(61,44,53,0.1)" }}
        >
          Back to site
        </Link>
      </header>

      {/* Tab nav */}
      <nav className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={`/admin?tab=${tab.id}`}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? "var(--pink)" : "rgba(255,255,255,0.9)",
              color: activeTab === tab.id ? "#fff" : "var(--charcoal)",
              border: activeTab === tab.id ? "none" : "1px solid rgba(232,130,154,0.2)",
              boxShadow: activeTab === tab.id ? "0 4px 14px rgba(232,130,154,0.3)" : "none",
            }}
          >
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background: activeTab === tab.id ? "rgba(255,255,255,0.3)" : "rgba(255,200,60,0.2)",
                  color: activeTab === tab.id ? "#fff" : "#c47f00",
                }}
              >
                {tab.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* ---- APPLICATIONS TAB ---- */}
      {activeTab === "applications" && (
        <section className="flex flex-col gap-6">
          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Pending", value: pendingCount, color: "#c47f00", bg: "rgba(255,200,60,0.1)" },
              { label: "Approved", value: approvedCount, color: "#5a9e95", bg: "rgba(90,158,149,0.1)" },
              { label: "Total", value: applications.length, color: "var(--charcoal)", bg: "rgba(255,255,255,0.9)" },
            ].map(({ label, value, color, bg }) => (
              <div
                key={label}
                className="rounded-3xl p-5"
                style={{ background: bg, border: "1px solid rgba(232,130,154,0.12)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
                  {label}
                </p>
                <p className="mt-1 text-4xl font-bold" style={{ fontFamily: "var(--font-playfair)", color }}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Application cards */}
          <div className="flex flex-col gap-4">
            {applications.length === 0 && (
              <div
                className="rounded-3xl border border-dashed p-12 text-center"
                style={{ borderColor: "rgba(232,130,154,0.25)" }}
              >
                <p style={{ color: "var(--muted)" }}>No applications yet.</p>
              </div>
            )}
            {applications.map((app) => {
              const status = STATUS_STYLES[app.status] ?? STATUS_STYLES.PENDING;
              return (
                <div
                  key={app.id}
                  className="rounded-3xl p-6"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    border: "1px solid rgba(232,130,154,0.12)",
                    boxShadow: "0 4px 20px rgba(61,44,53,0.05)",
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold" style={{ color: "var(--charcoal)" }}>
                          {app.salonName}
                        </h3>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-bold"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                        <div>
                          <span style={{ color: "var(--muted)" }}>Contact: </span>
                          <span className="font-medium">{app.contactName}</span>
                        </div>
                        <div>
                          <span style={{ color: "var(--muted)" }}>Email: </span>
                          <a href={`mailto:${app.email}`} className="font-medium" style={{ color: "var(--pink)" }}>
                            {app.email}
                          </a>
                        </div>
                        <div>
                          <span style={{ color: "var(--muted)" }}>Phone: </span>
                          <span className="font-medium">{app.phone}</span>
                        </div>
                        <div>
                          <span style={{ color: "var(--muted)" }}>Address: </span>
                          <span className="font-medium">{app.address}</span>
                        </div>
                        {app.chairs && (
                          <div>
                            <span style={{ color: "var(--muted)" }}>Chairs: </span>
                            <span className="font-medium">{app.chairs}</span>
                          </div>
                        )}
                        {app.bookingSoftware && (
                          <div>
                            <span style={{ color: "var(--muted)" }}>Software: </span>
                            <span className="font-medium">{app.bookingSoftware}</span>
                          </div>
                        )}
                      </div>
                      {app.notes && (
                        <p className="mt-3 text-sm italic" style={{ color: "var(--muted)" }}>
                          &ldquo;{app.notes}&rdquo;
                        </p>
                      )}
                      <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
                        Submitted {format(app.createdAt, "d MMM yyyy, h:mma")}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {app.status === "PENDING" ? (
                        <>
                          <form
                            action={async () => {
                              "use server";
                              await approveSalonApplication(app.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="w-full rounded-full py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
                              style={{ background: "#5a9e95", boxShadow: "0 4px 12px rgba(90,158,149,0.3)" }}
                            >
                              Approve
                            </button>
                          </form>
                          <form
                            action={async () => {
                              "use server";
                              await declineSalonApplication(app.id);
                            }}
                          >
                            <button
                              type="submit"
                              className="w-full rounded-full py-2.5 text-sm font-semibold transition-all hover:opacity-70"
                              style={{
                                color: "#c0392b",
                                border: "1px solid rgba(192,57,43,0.2)",
                                background: "rgba(192,57,43,0.05)",
                              }}
                            >
                              Decline
                            </button>
                          </form>
                        </>
                      ) : app.status === "APPROVED" ? (
                        <div
                          className="rounded-2xl p-3 text-center text-xs font-semibold"
                          style={{ background: "rgba(90,158,149,0.1)", color: "#5a9e95" }}
                        >
                          Approved — dashboard sent
                        </div>
                      ) : (
                        <div
                          className="rounded-2xl p-3 text-center text-xs font-semibold"
                          style={{ background: "rgba(192,57,43,0.08)", color: "#c0392b" }}
                        >
                          Declined
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---- SALONS TAB ---- */}
      {activeTab === "salons" && (
        <section className="flex flex-col gap-6">
          {/* Add salon form */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(232,130,154,0.12)",
              boxShadow: "0 4px 20px rgba(61,44,53,0.05)",
            }}
          >
            <h3 className="mb-4 text-lg font-bold" style={{ color: "var(--charcoal)" }}>
              Add salon manually
            </h3>
            <form action={createSalonAction} className="grid gap-3 text-sm sm:grid-cols-2">
              <input
                name="name"
                placeholder="Salon name"
                required
                className="rounded-2xl border px-4 py-3"
                style={{ borderColor: "rgba(232,130,154,0.2)", background: "rgba(253,240,245,0.5)", color: "var(--charcoal)" }}
              />
              <input
                name="city"
                placeholder="City"
                required
                className="rounded-2xl border px-4 py-3"
                style={{ borderColor: "rgba(232,130,154,0.2)", background: "rgba(253,240,245,0.5)", color: "var(--charcoal)" }}
              />
              <input
                name="address"
                placeholder="Address"
                className="rounded-2xl border px-4 py-3 sm:col-span-2"
                style={{ borderColor: "rgba(232,130,154,0.2)", background: "rgba(253,240,245,0.5)", color: "var(--charcoal)" }}
              />
              <textarea
                name="description"
                placeholder="Description"
                rows={2}
                className="rounded-2xl border px-4 py-3 sm:col-span-2"
                style={{ borderColor: "rgba(232,130,154,0.2)", background: "rgba(253,240,245,0.5)", color: "var(--charcoal)" }}
              />
              <button
                type="submit"
                className="rounded-full py-3 text-sm font-bold text-white transition-all hover:opacity-90 sm:col-span-2"
                style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.3)" }}
              >
                Create salon
              </button>
            </form>
          </div>

          {/* Salons table */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(232,130,154,0.12)",
              boxShadow: "0 4px 20px rgba(61,44,53,0.05)",
            }}
          >
            <div className="p-6 pb-0">
              <h3 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
                All salons ({salons.length})
              </h3>
            </div>
            <div className="mt-4 divide-y" style={{ divideColor: "rgba(232,130,154,0.1)" }}>
              {salons.length === 0 ? (
                <p className="p-6 text-sm" style={{ color: "var(--muted)" }}>No salons yet.</p>
              ) : (
                salons.map((salon) => (
                  <div key={salon.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold truncate" style={{ color: "var(--charcoal)" }}>
                        {salon.name}
                      </p>
                      <p className="text-sm truncate" style={{ color: "var(--muted)" }}>
                        {salon.address} · {salon.city}
                      </p>
                      {salon.email && (
                        <p className="text-xs" style={{ color: "var(--pink)" }}>{salon.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-right shrink-0">
                      <div>
                        <p className="font-bold" style={{ color: "var(--charcoal)" }}>
                          {salon.slots.length}
                        </p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>live slots</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---- BOOKINGS TAB ---- */}
      {activeTab === "bookings" && (
        <section>
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(232,130,154,0.12)",
              boxShadow: "0 4px 20px rgba(61,44,53,0.05)",
            }}
          >
            <div className="p-6 pb-0">
              <h3 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
                Recent bookings
              </h3>
            </div>
            <div className="mt-4 divide-y" style={{ divideColor: "rgba(232,130,154,0.1)" }}>
              {bookings.length === 0 ? (
                <p className="p-6 text-sm" style={{ color: "var(--muted)" }}>No bookings yet.</p>
              ) : (
                bookings.map((booking) => {
                  const tier = booking.slot.service.tier ?? "FULL";
                  const meta = TIER_META[tier] ?? TIER_META.FULL;
                  return (
                    <div
                      key={booking.id}
                      className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
                      style={{ background: booking.redeemedAt ? "rgba(90,158,149,0.03)" : undefined }}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold" style={{ color: "var(--charcoal)" }}>
                            {booking.customerName}
                          </p>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                            style={{ background: meta.bg, color: meta.color }}
                          >
                            {tier}
                          </span>
                          {booking.redeemedAt && (
                            <span
                              className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                              style={{ background: "rgba(90,158,149,0.12)", color: "#5a9e95" }}
                            >
                              Redeemed
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: "var(--muted)" }}>
                          {booking.slot.salon.name} · {format(booking.slot.startTime, "d MMM, h:mma")}
                        </p>
                        <p className="mt-1 font-mono text-xs font-bold tracking-widest" style={{ color: "var(--pink)" }}>
                          {booking.voucherCode}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-semibold" style={{ color: "var(--charcoal)" }}>
                          {booking.slot.discountPercent}% off
                        </p>
                        <p style={{ color: "var(--muted)" }}>{booking.status}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
