"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TIERS = [
  {
    value: "QUICK",
    label: "Quick",
    desc: "Trim, blowout, toner",
    duration: "Up to 45 min",
    color: "#5a9e95",
    bg: "rgba(90,158,149,0.1)",
  },
  {
    value: "FULL",
    label: "Full",
    desc: "Cut + colour, highlights",
    duration: "Up to 90 min",
    color: "#e8829a",
    bg: "rgba(232,130,154,0.1)",
  },
  {
    value: "PREMIUM",
    label: "Premium",
    desc: "Balayage, treatments",
    duration: "Up to 2.5 hrs",
    color: "#9b7fc8",
    bg: "rgba(155,127,200,0.1)",
  },
] as const;

type Service = { id: number; name: string };

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
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData(e.currentTarget);

    await fetch("/api/salon/slots", {
      method: "POST",
      body: JSON.stringify({
        salonId: Number(data.get("salonId")),
        serviceId: Number(data.get("serviceId")),
        startTime: data.get("startTime"),
        discountPercent: Number(data.get("discountPercent")),
        tier: data.get("tier"),
      }),
      headers: { "Content-Type": "application/json" },
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
                className="self-start rounded-full px-2 py-0.5 text-xs font-bold"
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
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
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
          defaultValue={localDatetimeDefault()}
          className="w-full rounded-2xl border px-4 py-3 text-sm"
          style={{
            borderColor: "rgba(232,130,154,0.2)",
            background: "rgba(253,240,245,0.5)",
            color: "var(--charcoal)",
          }}
        />
      </label>

      {/* Discount % — live update */}
      <div className="flex flex-col gap-1.5">
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
            {discount}% off
          </span>
        </div>
        <input
          type="range"
          name="discountPercent"
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

      <button
        type="submit"
        disabled={submitting || done}
        className="mt-2 w-full rounded-full py-4 text-base font-bold text-white transition-all hover:opacity-90 disabled:opacity-70"
        style={{ background: done ? "#5a9e95" : "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.35)" }}
      >
        {done ? "Slot published!" : submitting ? "Publishing…" : "Publish slot"}
      </button>
    </form>
  );
}
