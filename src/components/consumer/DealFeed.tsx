"use client";

import { useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import { createBookingAction } from "@/app/actions/booking";
import clsx from "clsx";
import { Sparkles, Star, MapPin, Clock, CreditCard } from "lucide-react";
import { DEMO_CUSTOMER_EMAIL, DEMO_CUSTOMER_NAME } from "@/lib/constants";

export type SerializedDeal = {
  id: number;
  startTime: string;
  endTime: string;
  price: number;
  discountPercent: number;
  status: string;
  salon: {
    id: number;
    name: string;
    city: string;
    address: string;
    rating: number;
    distanceKm: number;
  };
  service: {
    id: number;
    name: string;
    durationMin: number;
    basePrice: number;
  };
};

const timeFilters = [
  { value: "now", label: "Now" },
  { value: "2h", label: "Next 2h" },
  { value: "today", label: "Today" },
];

export function DealFeed({ deals }: { deals: SerializedDeal[] }) {
  const [selectedLocation, setSelectedLocation] = useState("All Sydney");
  const [timeFilter, setTimeFilter] = useState("now");
  const [selectedDeal, setSelectedDeal] = useState<SerializedDeal | null>(null);
  const [isPending, startTransition] = useTransition();
  const [confirmation, setConfirmation] = useState<null | { bookingId: number; slotTime: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const cities = ["All Sydney", ...new Set(deals.map((deal) => deal.salon.city))];

  const filteredDeals = useMemo(() => {
    const now = new Date();
    const thresholds = {
      now: new Date(now.getTime() + 60 * 60 * 1000),
      "2h": new Date(now.getTime() + 2 * 60 * 60 * 1000),
      today: new Date(new Date().setHours(23, 59, 59, 999)),
    };
    const windowEnd = thresholds[timeFilter as keyof typeof thresholds];

    return deals.filter((deal) => {
      const starts = new Date(deal.startTime);
      const matchesCity =
        selectedLocation === "All Sydney" || deal.salon.city === selectedLocation;
      return matchesCity && starts >= now && starts <= windowEnd;
    });
  }, [deals, selectedLocation, timeFilter]);

  const handleBook = (deal: SerializedDeal) => {
    setSelectedDeal(deal);
    setConfirmation(null);
    setError(null);
  };

  const completeBooking = (formData: FormData) => {
    if (!selectedDeal) return;
    startTransition(async () => {
      const result = await createBookingAction({
        slotId: selectedDeal.id,
        customerEmail: (formData.get("email") as string) || DEMO_CUSTOMER_EMAIL,
        customerName: (formData.get("name") as string) || DEMO_CUSTOMER_NAME,
        cardBrand: formData.get("cardBrand") as string,
        cardLast4: formData.get("cardLast4") as string,
      });

      if (!result.ok) {
        setError(result.message ?? "Something went wrong");
        return;
      }

      setConfirmation({
        bookingId: result.booking.id,
        slotTime: format(new Date(selectedDeal.startTime), "EEE d MMM • h:mma"),
      });
    });
  };

  return (
    <section className="space-y-4">
      <header className="soft-card flex flex-wrap items-center gap-3 rounded-3xl px-4 py-3">
        <div className="flex flex-1 items-center gap-2">
          <MapPin className="h-4 w-4 text-mint" />
          <select
            value={selectedLocation}
            onChange={(event) => setSelectedLocation(event.target.value)}
            className="flex-1 rounded-2xl bg-white/10 px-3 py-2 text-sm text-surface"
          >
            {cities.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 overflow-auto">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              className={clsx(
                "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest",
                timeFilter === filter.value ? "bg-coral text-charcoal" : "bg-white/10",
              )}
              onClick={() => setTimeFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      <div className="grid gap-4">
        {filteredDeals.map((deal) => (
          <article key={deal.id} className="soft-card rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-muted">
                  {deal.salon.city}
                </p>
                <h3 className="text-2xl font-semibold text-white">{deal.service.name}</h3>
                <p className="text-sm text-muted">{deal.salon.name}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-mint">${deal.price}</p>
                <p className="text-sm text-muted">-{deal.discountPercent}% today</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(new Date(deal.startTime), "h:mma")} • {deal.service.durationMin}m
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-coral" />
                {deal.salon.rating.toFixed(1)}
              </span>
              <span>{deal.salon.distanceKm.toFixed(1)} km away</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="flex-1 rounded-2xl bg-coral px-4 py-3 text-center font-semibold text-charcoal"
                onClick={() => handleBook(deal)}
              >
                Book for ${deal.price}
              </button>
              <button className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-muted">
                Details
              </button>
            </div>
          </article>
        ))}
        {filteredDeals.length === 0 && (
          <div className="rounded-3xl border border-white/5 p-10 text-center text-muted">
            Nothing in this window — expand your filters to see fresh drops.
          </div>
        )}
      </div>

      {selectedDeal && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 backdrop-blur">
          <div className="w-full max-w-lg rounded-t-3xl bg-surface p-6 text-charcoal">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-muted">Booking</p>
                <h3 className="text-2xl font-semibold">{selectedDeal.service.name}</h3>
                <p className="text-sm text-muted">{selectedDeal.salon.name}</p>
              </div>
              <button onClick={() => setSelectedDeal(null)} className="text-muted">
                Close
              </button>
            </header>
            {confirmation ? (
              <div className="space-y-4 text-center">
                <Sparkles className="mx-auto h-10 w-10 text-mint" />
                <p className="text-lg font-semibold">You&apos;re locked in!</p>
                <p className="text-muted">
                  Booking #{confirmation.bookingId} • {confirmation.slotTime}
                </p>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  completeBooking(formData);
                }}
              >
                <div className="grid gap-3 text-sm">
                  <label className="space-y-1">
                    <span className="text-muted">Name</span>
                    <input
                      name="name"
                      defaultValue={DEMO_CUSTOMER_NAME}
                      className="w-full rounded-2xl border border-charcoal/10 px-3 py-2"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-muted">Email</span>
                    <input
                      name="email"
                      defaultValue={DEMO_CUSTOMER_EMAIL}
                      className="w-full rounded-2xl border border-charcoal/10 px-3 py-2"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="space-y-1">
                      <span className="text-muted">Card Brand</span>
                      <input
                        name="cardBrand"
                        defaultValue="Visa"
                        className="w-full rounded-2xl border border-charcoal/10 px-3 py-2"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-muted">Last 4 digits</span>
                      <input
                        name="cardLast4"
                        defaultValue="1882"
                        className="w-full rounded-2xl border border-charcoal/10 px-3 py-2"
                      />
                    </label>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-charcoal px-4 py-3 font-semibold text-white"
                >
                  <CreditCard className="h-4 w-4" />
                  {isPending ? "Processing..." : `Pay $${selectedDeal.price}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
