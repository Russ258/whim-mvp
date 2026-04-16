"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: number;
  name: string;
  basePrice: number;
  durationMin: number;
  tier: string;
};

const DURATION_OPTIONS = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "60 min", value: 60 },
  { label: "75 min", value: 75 },
  { label: "90 min", value: 90 },
  { label: "2 hrs", value: 120 },
  { label: "2.5 hrs", value: 150 },
  { label: "3 hrs", value: 180 },
];

const TIER_COLOR: Record<string, { color: string; bg: string }> = {
  QUICK: { color: "#5a9e95", bg: "rgba(90,158,149,0.1)" },
  FULL: { color: "#e8829a", bg: "rgba(232,130,154,0.1)" },
  PREMIUM: { color: "#9b7fc8", bg: "rgba(155,127,200,0.1)" },
};

function tierFromDuration(min: number) {
  if (min <= 45) return "QUICK";
  if (min <= 90) return "FULL";
  return "PREMIUM";
}

export default function ServiceManager({
  salonId,
  initialServices,
}: {
  salonId: number;
  initialServices: Service[];
}) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(initialServices);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState(60);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const previewTier = tierFromDuration(duration);
  const tierMeta = TIER_COLOR[previewTier];

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    setAdding(true);
    setError(null);

    const res = await fetch("/api/salon/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salonId, name, basePrice: Number(price), durationMin: duration }),
    });
    const data = await res.json();
    setAdding(false);

    if (data.ok) {
      setServices((prev) => [...prev, data.service]);
      setName("");
      setPrice("");
      setDuration(60);
      router.refresh();
    } else {
      setError(data.error ?? "Something went wrong");
    }
  }

  async function handleDelete(serviceId: number) {
    setDeletingId(serviceId);
    setError(null);

    const res = await fetch("/api/salon/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId, salonId }),
    });
    const data = await res.json();
    setDeletingId(null);

    if (data.ok) {
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      router.refresh();
    } else {
      setError(data.error ?? "Could not delete");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Current services */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1px solid rgba(232,130,154,0.12)",
          boxShadow: "0 4px 20px rgba(61,44,53,0.05)",
        }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h3 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
            Your service menu
          </h3>
          <span className="text-sm" style={{ color: "var(--muted)" }}>
            {services.length} service{services.length !== 1 ? "s" : ""}
          </span>
        </div>

        {services.length === 0 ? (
          <div
            className="mx-6 mb-6 rounded-2xl border border-dashed p-8 text-center"
            style={{ borderColor: "rgba(232,130,154,0.3)" }}
          >
            <p className="text-sm font-medium" style={{ color: "var(--charcoal)" }}>
              No services yet
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Add your services below so customers know exactly what they're booking.
            </p>
          </div>
        ) : (
          <div className="divide-y px-6 pb-2" style={{ borderColor: "rgba(232,130,154,0.08)" }}>
            {services.map((service) => {
              const meta = TIER_COLOR[service.tier] ?? TIER_COLOR.FULL;
              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold" style={{ color: "var(--charcoal)" }}>
                        {service.name}
                      </p>
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-bold"
                        style={{ background: meta.bg, color: meta.color }}
                      >
                        {service.tier}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm" style={{ color: "var(--muted)" }}>
                      ${service.basePrice} · {service.durationMin} min
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(service.id)}
                    disabled={deletingId === service.id}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-70 disabled:opacity-40"
                    style={{
                      color: "#c0392b",
                      border: "1px solid rgba(192,57,43,0.2)",
                      background: "rgba(192,57,43,0.04)",
                    }}
                  >
                    {deletingId === service.id ? "Removing…" : "Remove"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add service form */}
      <div
        className="rounded-3xl p-6"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1.5px solid rgba(232,130,154,0.15)",
          boxShadow: "0 8px 40px rgba(61,44,53,0.08)",
        }}
      >
        <h3 className="mb-5 text-lg font-bold" style={{ color: "var(--charcoal)" }}>
          Add a service
        </h3>

        {error && (
          <div
            className="mb-4 rounded-2xl px-4 py-3 text-sm font-medium"
            style={{ background: "rgba(192,57,43,0.08)", color: "#c0392b", border: "1px solid rgba(192,57,43,0.15)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          {/* Service name */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
              Service name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Women's Cut & Blowdry"
              required
              className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{
                borderColor: "rgba(232,130,154,0.2)",
                background: "rgba(253,240,245,0.5)",
                color: "var(--charcoal)",
              }}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* Base price */}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
                Your normal price ($)
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="85"
                min={1}
                required
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                style={{
                  borderColor: "rgba(232,130,154,0.2)",
                  background: "rgba(253,240,245,0.5)",
                  color: "var(--charcoal)",
                }}
              />
            </label>

            {/* Duration */}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
                Duration
              </span>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-2xl border px-4 py-3 text-sm outline-none"
                style={{
                  borderColor: "rgba(232,130,154,0.2)",
                  background: "rgba(253,240,245,0.5)",
                  color: "var(--charcoal)",
                }}
              >
                {DURATION_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Tier preview */}
          <div
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm"
            style={{ background: tierMeta.bg }}
          >
            <span className="font-medium" style={{ color: tierMeta.color }}>
              Platform tier: {previewTier}
            </span>
            <span style={{ color: "var(--muted)" }}>
              · ${previewTier === "QUICK" ? 5 : previewTier === "FULL" ? 10 : 15} Whim fee per redeemed booking
            </span>
          </div>

          <button
            type="submit"
            disabled={adding}
            className="w-full rounded-full py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.3)" }}
          >
            {adding ? "Adding…" : "Add service"}
          </button>
        </form>
      </div>
    </div>
  );
}
