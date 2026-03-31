"use client";

import { useState, useTransition } from "react";
import { upsertNotificationPreference } from "@/app/actions/notifications";
import { BellRing } from "lucide-react";

export function NotificationOptInCard({
  email,
  initialPush,
  initialSms,
}: {
  email: string;
  initialPush: boolean;
  initialSms: boolean;
}) {
  const [wantsPush, setWantsPush] = useState(initialPush);
  const [wantsSms, setWantsSms] = useState(initialSms);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const save = () => {
    startTransition(async () => {
      await upsertNotificationPreference({ email, wantsPush, wantsSms });
      setMessage("Preferences updated");
      setTimeout(() => setMessage(null), 2500);
    });
  };

  return (
    <section className="soft-card rounded-3xl p-6">
      <div className="flex items-center gap-3">
        <BellRing className="h-10 w-10 text-coral" />
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Live alerts</p>
          <h3 className="text-2xl font-display">Stay in the loop</h3>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">
        We drop newly released cancellations and instant confirmations right here — opt in
        to never miss a slot.
      </p>
      <div className="mt-4 space-y-3 text-sm">
        <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
          <span>Push & email nudges</span>
          <input
            type="checkbox"
            checked={wantsPush}
            onChange={(event) => setWantsPush(event.target.checked)}
            className="h-5 w-5 rounded border-none text-coral"
          />
        </label>
        <label className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
          <span>SMS last-call reminders</span>
          <input
            type="checkbox"
            checked={wantsSms}
            onChange={(event) => setWantsSms(event.target.checked)}
            className="h-5 w-5 rounded border-none text-coral"
          />
        </label>
      </div>
      <button
        onClick={save}
        disabled={isPending}
        className="mt-5 w-full rounded-2xl bg-mint/90 px-4 py-3 font-semibold text-charcoal"
      >
        {isPending ? "Saving..." : "Save preferences"}
      </button>
      {message && <p className="mt-2 text-center text-xs text-muted">{message}</p>}
    </section>
  );
}
