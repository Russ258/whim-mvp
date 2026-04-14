import { createPromoAction, createSalonAction, createServiceAction, togglePromoAction } from "@/app/actions/admin";
import { updateBookingStatusAction } from "@/app/actions/booking";
import { getActiveRole } from "@/lib/auth";
import { getAdminSnapshot } from "@/lib/queries";
import Link from "next/link";

export default async function AdminPage() {
  const role = getActiveRole();
  if (role !== "admin") {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center text-charcoal">
        <p className="text-sm uppercase tracking-[0.35em] text-muted">Restricted</p>
        <h1 className="font-display text-4xl">Admin tools locked</h1>
        <p className="text-muted">Use the admin passcode on the login page to proceed.</p>
        <Link className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-charcoal" href="/login">
          Go to login
        </Link>
      </main>
    );
  }

  const { salons, services, bookings, promoCodes } = await getAdminSnapshot();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 text-charcoal">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Operations HQ</p>
          <h1 className="font-display text-4xl">Whim Command</h1>
        </div>
        <Link href="/salon" className="rounded-full border border-white/20 px-4 py-2 text-sm text-muted">
          View salon board
        </Link>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <form action={createSalonAction} className="soft-card rounded-3xl p-5 text-charcoal">
          <h3 className="text-2xl font-semibold text-white">Add salon</h3>
          <div className="mt-4 space-y-3 text-sm">
            <input name="name" placeholder="Name" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2" />
            <input name="city" placeholder="City" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2" />
            <input name="address" placeholder="Address" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2" />
            <textarea
              name="description"
              placeholder="Description"
              className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2"
            />
          </div>
          <button className="mt-4 w-full rounded-2xl bg-mint/80 px-4 py-2 font-semibold text-charcoal">
            Create salon
          </button>
        </form>

        <form action={createServiceAction} className="soft-card rounded-3xl p-5 text-charcoal">
          <h3 className="text-2xl font-semibold text-white">Add service</h3>
          <div className="mt-4 space-y-3 text-sm">
            <select name="salonId" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2">
              {salons.map((salon) => (
                <option key={salon.id} value={salon.id} className="text-charcoal">
                  {salon.name}
                </option>
              ))}
            </select>
            <input name="serviceName" placeholder="Service" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2" />
            <input name="durationMin" placeholder="Duration (min)" type="number" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2" />
            <input name="basePrice" placeholder="Base price" type="number" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2" />
          </div>
          <button className="mt-4 w-full rounded-2xl bg-coral px-4 py-2 font-semibold text-charcoal">
            Create service
          </button>
        </form>

        <form action={createPromoAction} className="soft-card rounded-3xl p-5 text-charcoal">
          <h3 className="text-2xl font-semibold text-white">Promo codes</h3>
          <div className="mt-4 space-y-3 text-sm">
            <input name="code" placeholder="Code" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2" />
            <input name="discountPercent" placeholder="Discount %" type="number" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2" />
            <textarea name="description" placeholder="Description" className="w-full rounded-2xl border border-white/20 bg-transparent px-3 py-2" />
          </div>
          <button className="mt-4 w-full rounded-2xl bg-white/10 px-4 py-2 font-semibold text-white">
            Save code
          </button>
        </form>
      </section>

      <section className="rounded-3xl border border-white/10 p-6">
        <h2 className="text-lg font-semibold">Manual overrides</h2>
        <form action={updateBookingStatusAction} className="mt-4 grid gap-3 text-sm text-charcoal md:grid-cols-3">
          <input name="bookingId" type="number" placeholder="Booking ID" className="rounded-2xl border border-white/20 bg-transparent px-3 py-2" />
          <select name="status" className="rounded-2xl border border-white/20 bg-transparent px-3 py-2 text-white">
            {['PENDING','CONFIRMED','CANCELLED','REFUNDED'].map((status) => (
              <option key={status} value={status} className="text-charcoal">
                {status}
              </option>
            ))}
          </select>
          <select name="paymentStatus" className="rounded-2xl border border-white/20 bg-transparent px-3 py-2 text-white">
            {['PENDING','PAID','REFUNDED'].map((status) => (
              <option key={status} value={status} className="text-charcoal">
                {status}
              </option>
            ))}
          </select>
          <button className="md:col-span-3 rounded-2xl bg-coral px-4 py-3 font-semibold text-charcoal">
            Apply override
          </button>
        </form>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 p-5">
          <h3 className="text-lg font-semibold">Latest bookings</h3>
          <div className="mt-3 space-y-3 text-sm text-muted">
            {bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-white/10 p-3">
                <p className="text-white">
                  #{booking.id} · {booking.slot.service.name} @ {booking.slot.salon.name}
                </p>
                <p>
                  {booking.customerName} · {booking.status} · {booking.paymentStatus}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 p-5">
          <h3 className="text-lg font-semibold">Promo codes</h3>
          <div className="mt-3 space-y-3 text-sm text-muted">
            {promoCodes.map((code) => (
              <form
                key={code.id}
                action={async () => {
                  "use server";
                  await togglePromoAction(code.id, !code.active);
                }}
                className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3"
              >
                <div>
                  <p className="text-white font-semibold">{code.code}</p>
                  <p>{code.description}</p>
                </div>
                <button className="rounded-full border border-white/10 px-3 py-1 text-xs">
                  {code.active ? "Disable" : "Enable"}
                </button>
              </form>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 p-5">
        <h3 className="text-lg font-semibold">Services directory</h3>
        <div className="mt-3 grid gap-3 text-sm text-muted">
          {services.map((service) => (
            <div key={service.id} className="rounded-2xl border border-white/10 p-3">
              <p className="text-white font-semibold">{service.name}</p>
              <p>
                {service.salon.name} · {service.durationMin}m · ${service.basePrice}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
