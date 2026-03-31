import Link from "next/link";
import { DEMO_CUSTOMER_EMAIL, DEMO_CUSTOMER_NAME } from "@/lib/constants";
import { getNotificationPreference } from "@/lib/queries";
import { NotificationOptInCard } from "@/components/consumer/NotificationOptInCard";
import { ShieldEllipsis } from "lucide-react";

export default async function ProfilePage() {
  const preference = await getNotificationPreference(DEMO_CUSTOMER_EMAIL);

  return (
    <main className="space-y-6">
      <section className="soft-card rounded-3xl p-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/10 text-center text-2xl font-semibold leading-[56px]">
            {DEMO_CUSTOMER_NAME.charAt(0)}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted">Customer</p>
            <h2 className="text-3xl font-display">{DEMO_CUSTOMER_NAME}</h2>
            <p className="text-sm text-muted">{DEMO_CUSTOMER_EMAIL}</p>
          </div>
        </div>
      </section>

      <NotificationOptInCard
        email={DEMO_CUSTOMER_EMAIL}
        initialPush={preference?.wantsPush ?? true}
        initialSms={preference?.wantsSms ?? false}
      />

      <section className="rounded-3xl border border-white/10 p-5 text-sm text-muted">
        <div className="flex items-center gap-3 text-white">
          <ShieldEllipsis className="h-5 w-5 text-mint" />
          <div>
            <p className="text-base font-semibold">Looking to manage salons?</p>
            <p className="text-sm text-muted">Hop into the appropriate dashboard.</p>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Link
            href="/login"
            className="flex-1 rounded-2xl bg-white/10 px-4 py-3 text-center font-semibold text-white"
          >
            Role switcher
          </Link>
          <Link
            href="/admin"
            className="flex-1 rounded-2xl border border-white/10 px-4 py-3 text-center font-semibold text-white"
          >
            Admin portal
          </Link>
        </div>
      </section>
    </main>
  );
}
