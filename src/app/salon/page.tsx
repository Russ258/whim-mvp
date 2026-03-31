import { createSlotAction, updateSlotStatusAction } from "@/app/actions/slots";
import { getActiveRole } from "@/lib/auth";
import { getSalonDashboardPayload, getSalons } from "@/lib/queries";
import { format } from "date-fns";
import Link from "next/link";

export default async function SalonDashboard({
  searchParams,
}: {
  searchParams: { salonId?: string };
}) {
  const role = getActiveRole();
  if (role !== "salon") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center text-surface">
        <p className="text-sm uppercase tracking-[0.35em] text-muted">Restricted</p>
        <h1 className="font-display text-4xl">Salon dashboard locked</h1>
        <p className="text-muted">Use the salon passcode on the login page to proceed.</p>
        <Link className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-charcoal" href="/login">
          Go to login
        </Link>
      </main>
    );
  }

  const salons = await getSalons();
  const activeSalonId = Number(searchParams.salonId) || salons[0]?.id;
  if (!activeSalonId) {
    return <p className="p-10 text-center text-white">No salons found. Create one in admin.</p>;
  }

  const dashboard = await getSalonDashboardPayload(activeSalonId);
  const salon = dashboard.salon;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-8 text-surface">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Salon partner</p>
          <h1 className="font-display text-4xl">{salon?.name}</h1>
          <p className="text-sm text-muted">{salon?.address}</p>
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
          <p className="text-muted">Quick switch</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {salons.map((s) => (
              <Link
                key={s.id}
                href={`/salon?salonId=${s.id}`}
                className={`rounded-full px-3 py-1 ${
                  s.id === activeSalonId ? "bg-coral text-charcoal" : "bg-white/10"
                }`}
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="soft-card rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Slots filled</p>
          <p className="text-4xl font-semibold">{dashboard.filledSlots}</p>
        </div>
        <div className="soft-card rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Revenue via Whim</p>
          <p className="text-4xl font-semibold">${dashboard.revenue}</p>
        </div>
        <div className="soft-card rounded-3xl p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Live listings</p>
          <p className="text-4xl font-semibold">{salon?.slots.length ?? 0}</p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold">Today&apos;s board</h2>
        <div className="mt-4 space-y-3">
          {salon?.slots.map((slot) => (
            <article key={slot.id} className="soft-card flex items-center justify-between rounded-2xl p-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-muted">
                  {slot.service.name}
                </p>
                <p className="text-2xl font-semibold text-white">
                  {format(slot.startTime, "h:mma")} · {slot.discountPercent}% off
                </p>
                <p className="text-xs text-muted">Status: {slot.status}</p>
              </div>
              <p className="text-2xl font-semibold text-mint">${slot.price}</p>
            </article>
          ))}
          {salon?.slots.length === 0 && (
            <p className="rounded-2xl border border-dashed border-white/20 p-6 text-center text-muted">
              No slots loaded today — create one below.
            </p>
          )}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <form action={createSlotAction} className="soft-card rounded-3xl p-6 text-charcoal">
          <input type="hidden" name="salonId" value={activeSalonId} />
          <h3 className="text-2xl font-semibold text-white">Add a last-minute slot</h3>
          <div className="mt-4 grid gap-3 text-sm">
            <label className="space-y-1 text-white">
              <span>Service</span>
              <select name="serviceId" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2">
                {salon?.services.map((service) => (
                  <option key={service.id} value={service.id} className="text-charcoal">
                    {service.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-white">
              <span>Start time</span>
              <input
                type="datetime-local"
                name="startTime"
                defaultValue={new Date().toISOString().slice(0, 16)}
                className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2 text-white"
              />
            </label>
            <label className="space-y-1 text-white">
              <span>Discount %</span>
              <input
                type="number"
                name="discountPercent"
                defaultValue={25}
                className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-white">
              <span>Deal price</span>
              <input
                type="number"
                name="price"
                defaultValue={120}
                className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2"
              />
            </label>
          </div>
          <button className="mt-4 w-full rounded-2xl bg-coral px-4 py-3 font-semibold text-charcoal">
            Publish slot
          </button>
        </form>

        <form action={updateSlotStatusAction} className="soft-card rounded-3xl p-6 text-charcoal">
          <h3 className="text-2xl font-semibold text-white">Update / cancel slot</h3>
          <label className="mt-4 block text-sm text-white">
            Slot ID
            <input
              type="number"
              name="slotId"
              placeholder="e.g. 12"
              className="mt-2 w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2"
            />
          </label>
          <label className="mt-3 block text-sm text-white">
            Status
            <select name="status" className="mt-2 w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2">
              <option value="AVAILABLE" className="text-charcoal">
                Available
              </option>
              <option value="BOOKED" className="text-charcoal">
                Booked
              </option>
              <option value="CANCELLED" className="text-charcoal">
                Cancelled
              </option>
            </select>
          </label>
          <button className="mt-5 w-full rounded-2xl bg-white/10 px-4 py-3 font-semibold text-white">
            Update slot
          </button>
        </form>
      </section>
    </main>
  );
}
