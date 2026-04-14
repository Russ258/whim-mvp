import { createSlotAction } from "@/app/actions/slots";
import { getActiveRole } from "@/lib/auth";
import { getSalonDashboardPayload, getSalons } from "@/lib/queries";
import { format } from "date-fns";
import Link from "next/link";

const TIERS = [
  { value: "QUICK", label: "Quick", desc: "Up to 45 min · blowdry, trim, toner" },
  { value: "FULL", label: "Full", desc: "Up to 90 min · cut & colour, highlights" },
  { value: "PREMIUM", label: "Premium", desc: "Up to 2.5 hrs · full colour, keratin, extensions" },
] as const;

function LockedScreen() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center"
      style={{ background: "var(--surface)" }}
    >
      <div
        className="flex h-20 w-20 items-center justify-center rounded-full text-3xl"
        style={{ background: "rgba(232,130,154,0.12)", color: "var(--pink)" }}
      >
        ⚿
      </div>
      <div>
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: "var(--muted)" }}
        >
          Restricted area
        </p>
        <h1
          className="text-4xl font-bold"
          style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
        >
          Salon dashboard locked
        </h1>
        <p className="mt-3 text-base" style={{ color: "var(--muted)" }}>
          Use the salon passcode on the login page to access your dashboard.
        </p>
      </div>
      <Link
        href="/salon/login"
        className="rounded-full px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
        style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.35)" }}
      >
        Go to salon login
      </Link>
    </main>
  );
}

export default async function SalonDashboard({
  searchParams,
}: {
  searchParams: Promise<{ salonId?: string }>;
}) {
  const role = getActiveRole();
  if (role !== "salon") {
    return <LockedScreen />;
  }

  const salons = await getSalons();
  const params = await searchParams;
  const activeSalonId = Number(params.salonId) || salons[0]?.id;
  if (!activeSalonId) {
    return (
      <main className="flex min-h-screen items-center justify-center" style={{ background: "var(--surface)" }}>
        <p style={{ color: "var(--muted)" }}>No salons found. Create one in admin.</p>
      </main>
    );
  }

  const dashboard = await getSalonDashboardPayload(activeSalonId);
  const salon = dashboard.salon;

  const todaysBookings = salon?.slots.flatMap((slot) =>
    slot.bookings.map((booking) => ({
      ...booking,
      slot,
    }))
  ) ?? [];

  const liveSlots = salon?.slots.filter((s) => s.status === "AVAILABLE").length ?? 0;

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
            <span style={{ color: "var(--muted-light)" }}>·</span>
            <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
              Salon partner
            </p>
          </div>
          <h1
            className="mt-1 text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--charcoal)" }}
          >
            {salon?.name}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {salon?.address}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {salons.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {salons.map((s) => (
                <Link
                  key={s.id}
                  href={`/salon?salonId=${s.id}`}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
                  style={{
                    background: s.id === activeSalonId ? "var(--pink)" : "rgba(61,44,53,0.06)",
                    color: s.id === activeSalonId ? "#fff" : "var(--muted)",
                  }}
                >
                  {s.name}
                </Link>
              ))}
            </div>
          )}
          <Link
            href="/redeem"
            target="_blank"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "var(--charcoal)", boxShadow: "0 4px 12px rgba(61,44,53,0.2)" }}
          >
            Redeem a voucher →
          </Link>
        </div>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Today's bookings", value: todaysBookings.length },
          { label: "Total filled slots", value: dashboard.filledSlots },
          { label: "Live slots", value: liveSlots },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-2 rounded-3xl p-6"
            style={{
              background: "rgba(255,255,255,0.9)",
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
                  No bookings yet today — your live slots are visible to customers.
                </p>
              </div>
            ) : (
              todaysBookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(232,130,154,0.12)",
                    boxShadow: "0 2px 12px rgba(61,44,53,0.05)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold" style={{ color: "var(--charcoal)" }}>
                        {booking.customerName ?? "Customer"}
                      </p>
                      <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>
                        {booking.slot.service.name} · {format(booking.slot.startTime, "h:mma")}
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
                          background: booking.redeemedAt
                            ? "rgba(157,212,200,0.2)"
                            : "rgba(61,44,53,0.06)",
                          color: booking.redeemedAt ? "#5a9e95" : "var(--muted)",
                        }}
                      >
                        {booking.redeemedAt ? "Redeemed" : "Pending"}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Today's slots board */}
          {(salon?.slots.length ?? 0) > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-base font-semibold" style={{ color: "var(--charcoal)" }}>
                Active slots today
              </h3>
              <div className="flex flex-col gap-2">
                {salon?.slots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between rounded-2xl px-5 py-4"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
                        {slot.service.name} · {format(slot.startTime, "h:mma")}
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {slot.discountPercent}% off · ${slot.price}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        background:
                          slot.status === "AVAILABLE"
                            ? "rgba(157,212,200,0.2)"
                            : slot.status === "BOOKED"
                            ? "rgba(232,130,154,0.12)"
                            : "rgba(61,44,53,0.06)",
                        color:
                          slot.status === "AVAILABLE"
                            ? "#5a9e95"
                            : slot.status === "BOOKED"
                            ? "var(--pink)"
                            : "var(--muted)",
                      }}
                    >
                      {slot.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Post a slot */}
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
            <input type="hidden" name="salonId" value={activeSalonId} />

            {/* Tier selector */}
            <fieldset>
              <legend
                className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--muted)" }}
              >
                Appointment tier
              </legend>
              <div className="flex flex-col gap-2">
                {TIERS.map(({ value, label, desc }) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-4 rounded-2xl border px-4 py-3 transition-all has-[:checked]:border-pink has-[:checked]:bg-pink-muted"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={value}
                      defaultChecked={value === "FULL"}
                      className="accent-pink"
                      style={{ accentColor: "var(--pink)" }}
                    />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
                        {label}
                      </p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>
                        {desc}
                      </p>
                    </div>
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
                  borderColor: "var(--border)",
                  background: "rgba(255,255,255,0.8)",
                  color: "var(--charcoal)",
                }}
              >
                {salon?.services.map((service) => (
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
                  borderColor: "var(--border)",
                  background: "rgba(255,255,255,0.8)",
                  color: "var(--charcoal)",
                }}
              />
            </label>

            {/* Discount % */}
            <label className="flex flex-col gap-1.5">
              <span
                className="text-xs font-semibold uppercase tracking-[0.3em]"
                style={{ color: "var(--muted)" }}
              >
                Discount %
              </span>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="discountPercent"
                  min={10}
                  max={50}
                  step={5}
                  defaultValue={25}
                  className="flex-1"
                  style={{ accentColor: "var(--pink)" }}
                />
                <input
                  type="number"
                  name="discountPercentDisplay"
                  min={10}
                  max={50}
                  defaultValue={25}
                  readOnly
                  className="w-16 rounded-xl border px-2 py-2 text-center text-sm font-bold"
                  style={{
                    borderColor: "rgba(232,130,154,0.3)",
                    color: "var(--pink)",
                    background: "rgba(232,130,154,0.06)",
                  }}
                />
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
                <span className="text-lg font-semibold" style={{ color: "var(--muted)" }}>
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  defaultValue={120}
                  min={1}
                  className="flex-1 rounded-2xl border px-4 py-3 text-sm"
                  style={{
                    borderColor: "var(--border)",
                    background: "rgba(255,255,255,0.8)",
                    color: "var(--charcoal)",
                  }}
                />
              </div>
            </label>

            <button
              type="submit"
              className="mt-2 w-full rounded-full py-4 text-base font-bold text-white transition-all hover:opacity-90"
              style={{
                background: "var(--pink)",
                boxShadow: "0 4px 14px rgba(232,130,154,0.35)",
              }}
            >
              Publish slot
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
