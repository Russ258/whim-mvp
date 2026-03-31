import { DEMO_CUSTOMER_EMAIL, DEMO_CUSTOMER_NAME } from "@/lib/constants";
import { getConsumerBookings, getSavedCards } from "@/lib/queries";
import { format } from "date-fns";
import { CreditCard, ArrowRight, ShieldCheck } from "lucide-react";

export default async function BookingsPage() {
  const [bookings, cards] = await Promise.all([
    getConsumerBookings(DEMO_CUSTOMER_EMAIL),
    getSavedCards(DEMO_CUSTOMER_EMAIL),
  ]);

  const now = new Date();
  const upcoming = bookings.filter((booking) => booking.slot.startTime > now);
  const past = bookings.filter((booking) => booking.slot.startTime <= now);

  return (
    <main className="space-y-6">
      <section className="soft-card rounded-3xl p-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">Welcome back</p>
            <h2 className="text-3xl font-display">{DEMO_CUSTOMER_NAME}</h2>
          </div>
          <ShieldCheck className="h-10 w-10 text-mint" />
        </header>
        <p className="mt-2 text-sm text-muted">
          Manage bookings, saved cards, and receipts in one glance.
        </p>
      </section>

      <section className="space-y-3">
        <header className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Upcoming</h3>
          <span className="text-xs uppercase tracking-[0.35em] text-muted">
            {upcoming.length} slots
          </span>
        </header>
        <div className="space-y-3">
          {upcoming.map((booking) => (
            <article key={booking.id} className="soft-card rounded-3xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-muted">
                    {booking.slot.salon.city}
                  </p>
                  <h4 className="text-2xl font-semibold text-white">
                    {booking.slot.service.name}
                  </h4>
                  <p className="text-sm text-muted">{booking.slot.salon.name}</p>
                </div>
                <div className="text-right text-sm text-muted">
                  <p>{format(booking.slot.startTime, "EEE d MMM")}</p>
                  <p>{format(booking.slot.startTime, "h:mma")}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-muted">
                <span>Status: {booking.status}</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </article>
          ))}
          {upcoming.length === 0 && (
            <div className="rounded-3xl border border-white/5 p-6 text-center text-muted">
              No future bookings. Grab a cancellation from the Discover tab.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Past visits</h3>
        <div className="grid gap-3">
          {past.map((booking) => (
            <article key={booking.id} className="rounded-3xl border border-white/5 p-4 text-sm text-muted">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {booking.slot.service.name} @ {booking.slot.salon.name}
                  </p>
                  <p>{format(booking.slot.startTime, "d MMM yyyy")}</p>
                </div>
                <span>{booking.paymentStatus}</span>
              </div>
            </article>
          ))}
          {past.length === 0 && (
            <p className="text-center text-muted">No history yet — we&apos;ll keep your receipts here.</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Saved cards</h3>
        <div className="grid gap-4">
          {cards.map((card) => (
            <div key={card.id} className="soft-card flex items-center justify-between rounded-3xl p-5">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-muted">{card.brand}</p>
                <p className="text-2xl font-semibold text-white">•••• {card.last4}</p>
                <p className="text-xs text-muted">
                  Exp {card.expiryMonth}/{card.expiryYear}
                </p>
              </div>
              {card.primary && (
                <span className="rounded-full bg-mint/20 px-3 py-1 text-xs font-semibold text-mint">
                  Default
                </span>
              )}
            </div>
          ))}
          {cards.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/20 p-6 text-center text-muted">
              <p className="mb-2 text-sm">No cards saved</p>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-white">
                <CreditCard className="h-4 w-4" /> Add a card
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
