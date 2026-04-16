"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Service = {
  id: number;
  name: string;
  basePrice: number;
  durationMin: number;
  tier: string;
};

function localDatetimeDefault() {
  const now = new Date();
  now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);
  return now.toISOString().slice(0, 16);
}

export default function SlotForm({
  salonId,
  services,
}: {
  salonId: number;
  services: Service[];
}) {
  const router = useRouter();
  const [discount, setDiscount] = useState(25);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(
    services[0]?.id ?? null
  );
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const savedAmount = selectedService
    ? Math.round((selectedService.basePrice * discount) / 100)
    : null;

  if (services.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-4 rounded-3xl p-8 text-center"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1.5px dashed rgba(232,130,154,0.3)",
        }}
      >
        <p className="text-base font-semibold" style={{ color: "var(--charcoal)" }}>
          Set up your services first
        </p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Add your service menu before posting slots — customers need to know what they're booking.
        </p>
        <Link
          href="/salon?tab=services"
          className="rounded-full px-6 py-2.5 text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.3)" }}
        >
          Add services →
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedServiceId) return;
    setSubmitting(true);

    await fetch("/api/salon/slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salonId,
        serviceId: selectedServiceId,
        startTime: (e.currentTarget.elements.namedItem("startTime") as HTMLInputElement).value,
        discountPercent: discount,
      }),
    });

    setSubmitting(false);
    setDone(true);
    setTimeout(() => {
      setDone(false);
      router.refresh();
    }, 1500);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-3xl p-6 sm:p-7"
      style={{
        background: "rgba(255,255,255,0.95)",
        border: "1.5px solid rgba(232,130,154,0.15)",
        boxShadow: "0 8px 40px rgba(61,44,53,0.08)",
      }}
    >
      {/* Service picker */}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
          Service
        </span>
        <select
          value={selectedServiceId ?? ""}
          onChange={(e) => setSelectedServiceId(Number(e.target.value))}
          className="w-full rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: "rgba(232,130,154,0.2)",
            background: "rgba(253,240,245,0.5)",
            color: "var(--charcoal)",
          }}
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · ${s.basePrice} · {s.durationMin}min
            </option>
          ))}
        </select>
      </label>

      {/* Start time */}
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
          Start time
        </span>
        <input
          type="datetime-local"
          name="startTime"
          defaultValue={localDatetimeDefault()}
          className="w-full rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: "rgba(232,130,154,0.2)",
            background: "rgba(253,240,245,0.5)",
            color: "var(--charcoal)",
          }}
        />
      </label>

      {/* Discount slider */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
            Discount
          </span>
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-3 py-1 text-sm font-bold"
              style={{ background: "rgba(232,130,154,0.1)", color: "var(--pink)" }}
            >
              {discount}% off
            </span>
            {savedAmount !== null && (
              <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
                customer saves ${savedAmount}
              </span>
            )}
          </div>
        </div>
        <input
          type="range"
          min={10}
          max={50}
          step={5}
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: "var(--pink)" }}
        />
        <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
          <span>10%</span>
          <span>50%</span>
        </div>
      </div>

      {/* Price preview */}
      {selectedService && (
        <div
          className="rounded-2xl px-4 py-3 text-sm"
          style={{ background: "rgba(232,130,154,0.06)", border: "1px solid rgba(232,130,154,0.12)" }}
        >
          <p style={{ color: "var(--charcoal)" }}>
            Customer pays{" "}
            <strong style={{ color: "var(--pink)" }}>
              ${selectedService.basePrice - savedAmount!}
            </strong>
            {" "}instead of ${selectedService.basePrice}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || done || !selectedServiceId}
        className="mt-1 w-full rounded-full py-4 text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-70"
        style={{
          background: done ? "#5a9e95" : "var(--pink)",
          boxShadow: "0 4px 14px rgba(232,130,154,0.35)",
        }}
      >
        {done ? "Slot published!" : submitting ? "Publishing…" : "Publish slot"}
      </button>
    </form>
  );
}
