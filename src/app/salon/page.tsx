import { updateSlotStatusAction } from "@/app/actions/slots";
import { getActiveSalonId } from "@/lib/auth";
import { getSalonByAccount } from "@/lib/queries";
import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import SlotForm from "./SlotForm";
import ServiceManager from "./ServiceManager";
import AvailabilityManager from "./AvailabilityManager";
import { prisma } from "@/lib/prisma";


const TIER_META: Record<string, { color: string; bg: string; label: string }> = {
  QUICK: { color: "#5a9e95", bg: "rgba(90,158,149,0.12)", label: "Quick" },
  FULL: { color: "#e8829a", bg: "rgba(232,130,154,0.12)", label: "Full" },
  PREMIUM: { color: "#9b7fc8", bg: "rgba(155,127,200,0.12)", label: "Premium" },
};

async function signOutSalon() {
  "use server";
  const cookieStore = await cookies();
  cookieStore.delete("whim_salon_id");
  cookieStore.delete("whim_salon_token");
  redirect("/salon/login");
}

export default async function SalonDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const salonId = await getActiveSalonId();

  if (!salonId) {
    redirect("/salon/login");
  }

  const data = await getSalonByAccount(salonId);

  if (!data) {
    redirect("/salon/login");
  }

  const { salon, todaysBookings, liveSlots, monthlyRedeemed } = data;
  const params = await searchParams;
  const activeTab = params.tab ?? "dashboard";

  const availabilityWindows = await prisma.availabilityWindow.findMany({
    where: { salonId },
    include: { service: true },
    orderBy: [{ dayOfWeek: "asc" }, { startHour: "asc" }],
  });

  return (
    <main
      className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-10"
      style={{ color: "var(--charcoal)" }}
    >
      {/* Header */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--pink)" }}
            >
              Whim
            </Link>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{ background: "rgba(232,130,154,0.12)", color: "var(--pink)" }}
            >
              Salon Partner
            </span>
          </div>
          <h1
            className="mt-2 text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            {salon.name}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {salon.address}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/redeem"
            target="_blank"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.35)" }}
          >
            Redeem voucher →
          </Link>
          <form action={signOutSalon}>
            <button
              type="submit"
              className="rounded-full px-4 py-2.5 text-sm font-medium transition-all hover:opacity-70"
              style={{ color: "var(--muted)", border: "1px solid rgba(61,44,53,0.1)" }}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="flex gap-2">
        {[
          { id: "dashboard", label: "Dashboard" },
          { id: "availability", label: "Availability", badge: availabilityWindows.length === 0 && salon.services.length > 0 ? "!" : undefined },
          { id: "services", label: "Services", badge: salon.services.length === 0 ? "!" : undefined },
        ].map((tab) => (
          <Link
            key={tab.id}
            href={`/salon?tab=${tab.id}`}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
            style={{
              background: activeTab === tab.id ? "var(--pink)" : "rgba(255,255,255,0.9)",
              color: activeTab === tab.id ? "#fff" : "var(--charcoal)",
              border: activeTab === tab.id ? "none" : "1px solid rgba(232,130,154,0.2)",
              boxShadow: activeTab === tab.id ? "0 4px 14px rgba(232,130,154,0.3)" : "none",
            }}
          >
            {tab.label}
            {tab.badge && (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "rgba(255,200,60,0.2)", color: "#c47f00" }}
              >
                {tab.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* ── AVAILABILITY TAB ── */}
      {activeTab === "availability" && (
        <AvailabilityManager
          salonId={salonId}
          services={salon.services}
          initialWindows={availabilityWindows}
        />
      )}

      {/* ── SERVICES TAB ── */}
      {activeTab === "services" && (
        <ServiceManager salonId={salonId} initialServices={salon.services} />
      )}

      {/* ── DASHBOARD TAB ── */}
      {activeTab === "dashboard" && <>

      {/* Stats row */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Today's bookings", value: todaysBookings.length },
          { label: "This month redeemed", value: monthlyRedeemed },
          { label: "Live slots right now", value: liveSlots.length },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-2 rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(232,130,154,0.12)",
              boxShadow: "0 4px 20px rgba(61,44,53,0.06)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--muted)" }}
            >
              {label}
            </p>
            <p
              className="text-5xl font-bold"
              style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
            >
              {value}
            </p>
          </div>
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left column: bookings + live slots */}
        <div className="flex flex-col gap-8">
          {/* Today's bookings */}
          <section>
            <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--charcoal)" }}>
              Today&apos;s bookings
            </h2>
            <div className="flex flex-col gap-3">
              {todaysBookings.length === 0 ? (
                <div
                  className="rounded-3xl border border-dashed p-10 text-center"
                  style={{ borderColor: "rgba(232,130,154,0.25)" }}
                >
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    No bookings yet today — post a slot to get started.
                  </p>
                </div>
              ) : (
                todaysBookings.map((booking) => {
                  const tier = booking.slot.service.tier ?? "FULL";
                  const meta = TIER_META[tier] ?? TIER_META.FULL;
                  return (
                    <article
                      key={booking.id}
                      className="rounded-2xl p-5"
                      style={{
                        background: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(232,130,154,0.12)",
                        boxShadow: "0 2px 12px rgba(61,44,53,0.05)",
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="truncate text-base font-semibold" style={{ color: "var(--charcoal)" }}>
                              {booking.customerName ?? "Customer"}
                            </p>
                            <span
                              className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                              style={{ background: meta.bg, color: meta.color }}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>
                            {format(booking.slot.startTime, "h:mma")}
                          </p>
                          <p className="mt-1.5 font-mono text-sm font-bold tracking-widest" style={{ color: "var(--pink)" }}>
                            {booking.voucherCode}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span
                            className="rounded-full px-3 py-1 text-xs font-bold"
                            style={{ background: "rgba(232,130,154,0.12)", color: "var(--pink)" }}
                          >
                            {booking.slot.discountPercent}% off
                          </span>
                          <span
                            className="rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              background: booking.redeemedAt ? "rgba(90,158,149,0.12)" : "rgba(61,44,53,0.06)",
                              color: booking.redeemedAt ? "#5a9e95" : "var(--muted)",
                            }}
                          >
                            {booking.redeemedAt ? "Redeemed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>

          {/* Live slots */}
          <section>
            <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--charcoal)" }}>
              Your live slots
            </h2>
            <div className="flex flex-col gap-3">
              {liveSlots.length === 0 ? (
                <div
                  className="rounded-3xl border border-dashed p-8 text-center"
                  style={{ borderColor: "rgba(232,130,154,0.25)" }}
                >
                  <p className="text-sm" style={{ color: "var(--muted)" }}>
                    No live slots — post one to appear on the feed.
                  </p>
                </div>
              ) : (
                liveSlots.map((slot) => {
                  const tier = slot.service.tier ?? "FULL";
                  const meta = TIER_META[tier] ?? TIER_META.FULL;
                  return (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between gap-3 rounded-2xl px-5 py-4"
                      style={{
                        background: "rgba(255,255,255,0.95)",
                        border: "1px solid rgba(232,130,154,0.12)",
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                            style={{ background: meta.bg, color: meta.color }}
                          >
                            {meta.label}
                          </span>
                          <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
                            {format(slot.startTime, "EEE d MMM, h:mma")}
                          </p>
                        </div>
                        <p className="mt-0.5 text-xs" style={{ color: "var(--muted)" }}>
                          {slot.discountPercent}% off · ${slot.price}
                        </p>
                      </div>
                      <form action={updateSlotStatusAction}>
                        <input type="hidden" name="slotId" value={slot.id} />
                        <input type="hidden" name="status" value="CANCELLED" />
                        <button
                          type="submit"
                          className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-70"
                          style={{ color: "#c0392b", border: "1px solid rgba(192,57,43,0.2)", background: "rgba(192,57,43,0.05)" }}
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* Right column: post a slot */}
        <section>
          <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--charcoal)" }}>
            Post a slot
          </h2>
          <SlotForm salonId={salonId} services={salon.services} />
        </section>
      </div>

      {/* Platform fee notice */}
      <div
        className="rounded-2xl px-6 py-4"
        style={{
          background: "rgba(232,130,154,0.06)",
          border: "1px solid rgba(232,130,154,0.12)",
        }}
      >
        <p className="text-xs" style={{ color: "var(--muted)" }}>
          <span className="font-semibold" style={{ color: "var(--charcoal)" }}>Whim platform fee:</span>{" "}
          $10 flat fee per redeemed booking. Invoiced monthly. No setup fee, no subscription.
        </p>
      </div>

      </>}
    </main>
  );
}
