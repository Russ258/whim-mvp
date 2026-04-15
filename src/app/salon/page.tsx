import { createSlotAction, updateSlotStatusAction } from "@/app/actions/slots";
import { getActiveSalonId } from "@/lib/auth";
import { getSalonByAccount } from "@/lib/queries";
import { format } from "date-fns";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const TIERS = [
  {
    value: "QUICK",
    label: "Quick",
    desc: "Trim, blowout, toner",
    duration: "Up to 45 min",
    fee: "$5",
    color: "#5a9e95",
    bg: "rgba(90,158,149,0.1)",
  },
  {
    value: "FULL",
    label: "Full",
    desc: "Cut + colour, highlights",
    duration: "Up to 90 min",
    fee: "$10",
    color: "#e8829a",
    bg: "rgba(232,130,154,0.1)",
  },
  {
    value: "PREMIUM",
    label: "Premium",
    desc: "Balayage, treatments",
    duration: "Up to 2.5 hrs",
    fee: "$15",
    color: "#9b7fc8",
    bg: "rgba(155,127,200,0.1)",
  },
] as const;

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

export default async function SalonDashboard() {
  const salonId = await getActiveSalonId();

  if (!salonId) {
    redirect("/salon/login");
  }

  const data = await getSalonByAccount(salonId);

  if (!data) {
    redirect("/salon/login");
  }

  const { salon, todaysBookings, liveSlots, monthlyRedeemed } = data;

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
            style={{ background: "var(--charcoal)", boxShadow: "0 4px 12px rgba(61,44,53,0.2)" }}
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
          <form
            action={createSlotAction}
            className="flex flex-col gap-5 rounded-3xl p-6 sm:p-7"
            style={{
              background: "rgba(255,255,255,0.95)",
              border: "1.5px solid rgba(232,130,154,0.15)",
              boxShadow: "0 8px 40px rgba(61,44,53,0.08)",
            }}
          >
            <input type="hidden" name="salonId" value={salonId} />

            {/* Tier selector */}
            <fieldset>
              <legend
                className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--muted)" }}
              >
                Appointment tier
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {TIERS.map(({ value, label, desc, duration, color, bg }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer flex-col gap-1.5 rounded-2xl border p-3 transition-all has-[:checked]:border-pink-300"
                    style={{ borderColor: "rgba(232,130,154,0.2)" }}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={value}
                      defaultChecked={value === "FULL"}
                      className="sr-only"
                    />
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-bold self-start"
                      style={{ background: bg, color }}
                    >
                      {label}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "var(--charcoal)" }}>
                      {desc}
                    </span>
                    <span className="text-xs" style={{ color: "var(--muted)" }}>
                      {duration}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Service */}
            <label className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--muted)" }}
              >
                Service
              </span>
              <select
                name="serviceId"
                className="w-full rounded-2xl border px-4 py-3 text-sm"
                style={{
                  borderColor: "rgba(232,130,154,0.2)",
                  background: "rgba(253,240,245,0.5)",
                  color: "var(--charcoal)",
                }}
              >
                {salon.services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Start time */}
            <label className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--muted)" }}
              >
                Start time
              </span>
              <input
                type="datetime-local"
                name="startTime"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full rounded-2xl border px-4 py-3 text-sm"
                style={{
                  borderColor: "rgba(232,130,154,0.2)",
                  background: "rgba(253,240,245,0.5)",
                  color: "var(--charcoal)",
                }}
              />
            </label>

            {/* Discount % */}
            <label className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.3em]"
                  style={{ color: "var(--muted)" }}
                >
                  Discount
                </span>
                <span
                  className="rounded-full px-3 py-1 text-sm font-bold"
                  style={{ background: "rgba(232,130,154,0.1)", color: "var(--pink)" }}
                >
                  25% off
                </span>
              </div>
              <input
                type="range"
                name="discountPercent"
                min={10}
                max={50}
                step={5}
                defaultValue={25}
                className="w-full"
                style={{ accentColor: "var(--pink)" }}
              />
              <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
                <span>10%</span>
                <span>50%</span>
              </div>
            </label>

            {/* Deal price */}
            <label className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--muted)" }}
              >
                Deal price ($)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold" style={{ color: "var(--muted)" }}>$</span>
                <input
                  type="number"
                  name="price"
                  defaultValue={90}
                  min={1}
                  className="flex-1 rounded-2xl border px-4 py-3 text-sm"
                  style={{
                    borderColor: "rgba(232,130,154,0.2)",
                    background: "rgba(253,240,245,0.5)",
                    color: "var(--charcoal)",
                  }}
                />
              </div>
            </label>

            <button
              type="submit"
              className="mt-2 w-full rounded-full py-4 text-base font-bold text-white transition-all hover:opacity-90"
              style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.35)" }}
            >
              Publish slot
            </button>
          </form>
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
          Quick $5 · Full $10 · Premium $15 per redeemed booking. Invoiced monthly.
        </p>
      </div>
    </main>
  );
}
