"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Service = { id: number; name: string; durationMin: number; basePrice: number };
type Window = {
  id: number;
  serviceId: number;
  dayOfWeek: number;
  startHour: number;
  endHour: number;
  service: Service;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function hourLabel(h: number) {
  if (h === 0) return "12am";
  if (h < 12) return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
}

function slotsPerWindow(w: Window) {
  const blocks = Math.floor(
    ((w.endHour - w.startHour) * 60) / w.service.durationMin
  );
  return blocks;
}

export default function AvailabilityManager({
  salonId,
  services,
  initialWindows,
}: {
  salonId: number;
  services: Service[];
  initialWindows: Window[];
}) {
  const router = useRouter();
  const [windows, setWindows] = useState<Window[]>(initialWindows);
  const [serviceId, setServiceId] = useState<number>(services[0]?.id ?? 0);
  const [dayOfWeek, setDayOfWeek] = useState(1); // Mon
  const [startHour, setStartHour] = useState(14); // 2pm
  const [endHour, setEndHour] = useState(17); // 5pm
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (services.length === 0) {
    return (
      <div
        className="rounded-3xl p-10 text-center"
        style={{ background: "rgba(255,255,255,0.95)", border: "1.5px dashed rgba(232,130,154,0.3)" }}
      >
        <p className="font-semibold" style={{ color: "var(--charcoal)" }}>Add your services first</p>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Go to the Services tab and add your menu before setting availability.
        </p>
      </div>
    );
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (startHour >= endHour) {
      setError("End time must be after start time");
      return;
    }
    setAdding(true);
    setError(null);

    const res = await fetch("/api/salon/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salonId, serviceId, dayOfWeek, startHour, endHour }),
    });
    const data = await res.json();
    setAdding(false);

    if (data.ok) {
      setWindows((prev) => [...prev, data.window]);
      router.refresh();
    } else {
      setError(data.error ?? "Something went wrong");
    }
  }

  async function handleDelete(windowId: number) {
    setDeletingId(windowId);
    const res = await fetch("/api/salon/availability", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ windowId, salonId }),
    });
    const data = await res.json();
    setDeletingId(null);
    if (data.ok) {
      setWindows((prev) => prev.filter((w) => w.id !== windowId));
      router.refresh();
    }
  }

  // Group windows by day
  const byDay = DAYS.map((day, i) => ({
    day,
    dow: i,
    windows: windows.filter((w) => w.dayOfWeek === i),
  })).filter((d) => d.windows.length > 0);

  return (
    <div className="flex flex-col gap-6">
      {/* How it works callout */}
      <div
        className="rounded-2xl px-5 py-4"
        style={{ background: "rgba(232,130,154,0.06)", border: "1px solid rgba(232,130,154,0.12)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
          How this works
        </p>
        <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          Set your typical quiet hours below. Every night at midnight, Whim automatically posts slots
          for tomorrow during those windows — no action needed from you. Discounts increase the closer
          to the appointment time (20% → 35%). When a booking comes in, you&apos;ll get an instant
          email with a one-click link to cancel if needed.
        </p>
      </div>

      {/* Current windows */}
      {byDay.length > 0 && (
        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(232,130,154,0.12)",
            boxShadow: "0 4px 20px rgba(61,44,53,0.05)",
          }}
        >
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-lg font-bold" style={{ color: "var(--charcoal)" }}>
              Your availability windows
            </h3>
          </div>
          <div className="divide-y px-6 pb-2">
            {byDay.map(({ day, windows: dayWindows }) => (
              <div key={day} className="py-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em]" style={{ color: "var(--pink)" }}>
                  {day}
                </p>
                <div className="flex flex-col gap-2">
                  {dayWindows.map((w) => {
                    const slots = slotsPerWindow(w);
                    return (
                      <div
                        key={w.id}
                        className="flex items-center justify-between gap-3 rounded-2xl px-4 py-3"
                        style={{ background: "rgba(232,130,154,0.04)", border: "1px solid rgba(232,130,154,0.1)" }}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold" style={{ color: "var(--charcoal)" }}>
                            {w.service.name}
                          </p>
                          <p className="text-xs" style={{ color: "var(--muted)" }}>
                            {hourLabel(w.startHour)} – {hourLabel(w.endHour)}
                            {" · "}{slots} slot{slots !== 1 ? "s" : ""} auto-created
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(w.id)}
                          disabled={deletingId === w.id}
                          className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-70 disabled:opacity-40"
                          style={{ color: "#c0392b", border: "1px solid rgba(192,57,43,0.2)", background: "rgba(192,57,43,0.04)" }}
                        >
                          {deletingId === w.id ? "Removing…" : "Remove"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add window form */}
      <div
        className="rounded-3xl p-6"
        style={{
          background: "rgba(255,255,255,0.95)",
          border: "1.5px solid rgba(232,130,154,0.15)",
          boxShadow: "0 8px 40px rgba(61,44,53,0.08)",
        }}
      >
        <h3 className="mb-5 text-lg font-bold" style={{ color: "var(--charcoal)" }}>
          Add availability window
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
          {/* Service */}
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
              Service
            </span>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(Number(e.target.value))}
              className="w-full rounded-2xl border px-4 py-3 text-sm"
              style={{ borderColor: "rgba(232,130,154,0.2)", background: "rgba(253,240,245,0.5)", color: "var(--charcoal)" }}
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · ${s.basePrice} · {s.durationMin}min
                </option>
              ))}
            </select>
          </label>

          {/* Day of week */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
              Day
            </span>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day, i) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setDayOfWeek(i)}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
                  style={{
                    background: dayOfWeek === i ? "var(--pink)" : "rgba(232,130,154,0.08)",
                    color: dayOfWeek === i ? "#fff" : "var(--charcoal)",
                    border: dayOfWeek === i ? "none" : "1px solid rgba(232,130,154,0.15)",
                  }}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
                From
              </span>
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="w-full rounded-2xl border px-4 py-3 text-sm"
                style={{ borderColor: "rgba(232,130,154,0.2)", background: "rgba(253,240,245,0.5)", color: "var(--charcoal)" }}
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>{hourLabel(h)}</option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: "var(--muted)" }}>
                Until
              </span>
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="w-full rounded-2xl border px-4 py-3 text-sm"
                style={{ borderColor: "rgba(232,130,154,0.2)", background: "rgba(253,240,245,0.5)", color: "var(--charcoal)" }}
              >
                {HOURS.filter((h) => h > startHour).map((h) => (
                  <option key={h} value={h}>{hourLabel(h)}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Preview */}
          {endHour > startHour && services.find(s => s.id === serviceId) && (() => {
            const svc = services.find(s => s.id === serviceId)!;
            const count = Math.floor(((endHour - startHour) * 60) / svc.durationMin);
            return (
              <div
                className="rounded-2xl px-4 py-3 text-sm"
                style={{ background: "rgba(90,158,149,0.07)", border: "1px solid rgba(90,158,149,0.15)" }}
              >
                <span style={{ color: "#5a9e95", fontWeight: 600 }}>
                  {count} slot{count !== 1 ? "s" : ""} will be auto-created
                </span>
                <span style={{ color: "var(--muted)" }}>
                  {" "}every {DAYS[dayOfWeek]} at {hourLabel(startHour)}{count > 1 ? `, ${hourLabel(startHour + Math.ceil(svc.durationMin / 60))}` : ""}{count > 2 ? "…" : ""}
                </span>
              </div>
            );
          })()}

          <button
            type="submit"
            disabled={adding}
            className="w-full rounded-full py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60"
            style={{ background: "var(--pink)", boxShadow: "0 4px 14px rgba(232,130,154,0.3)" }}
          >
            {adding ? "Saving…" : "Save window"}
          </button>
        </form>
      </div>
    </div>
  );
}
