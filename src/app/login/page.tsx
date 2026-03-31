import { selectRole, signOutRole } from "@/app/actions/auth";
import { getActiveRole } from "@/lib/auth";
import { ADMIN_ROLE_PASSCODE, SALON_ROLE_PASSCODE } from "@/lib/constants";

export default async function LoginPage() {
  const activeRole = getActiveRole();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-4 py-10 text-surface">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-muted">Role access</p>
        <h1 className="font-display text-4xl">Switch roles</h1>
        <p className="text-sm text-muted">
          Current role: <span className="font-semibold">{activeRole ?? "consumer"}</span>
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <form action={selectRole} className="soft-card rounded-3xl p-5">
          <input type="hidden" name="role" value="consumer" />
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Guest</p>
          <h3 className="text-2xl font-semibold text-white">Consumer</h3>
          <p className="text-sm text-muted">
            Default experience with landing page, booking flow, and saved cards.
          </p>
          <button className="mt-4 w-full rounded-2xl bg-coral px-4 py-3 font-semibold text-charcoal">
            Activate
          </button>
        </form>

        <form action={selectRole} className="soft-card rounded-3xl p-5">
          <input type="hidden" name="role" value="salon" />
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Partner</p>
          <h3 className="text-2xl font-semibold text-white">Salon dashboard</h3>
          <p className="text-sm text-muted">
            Enter passcode <code className="text-white">{SALON_ROLE_PASSCODE}</code>
          </p>
          <input
            name="passcode"
            placeholder="passcode"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2"
          />
          <button className="mt-4 w-full rounded-2xl bg-mint/80 px-4 py-3 font-semibold text-charcoal">
            Unlock salon
          </button>
        </form>

        <form action={selectRole} className="soft-card rounded-3xl p-5 sm:col-span-2">
          <input type="hidden" name="role" value="admin" />
          <p className="text-xs uppercase tracking-[0.35em] text-muted">Ops</p>
          <h3 className="text-2xl font-semibold text-white">Admin back office</h3>
          <p className="text-sm text-muted">
            Use passcode <code className="text-white">{ADMIN_ROLE_PASSCODE}</code>
          </p>
          <input
            name="passcode"
            placeholder="Admin passcode"
            className="mt-3 w-full rounded-2xl border border-white/10 bg-transparent px-3 py-2"
          />
          <button className="mt-4 w-full rounded-2xl bg-charcoal px-4 py-3 font-semibold text-white">
            Unlock admin
          </button>
        </form>
      </section>

      <form action={signOutRole}>
        <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted">
          Clear role cookie
        </button>
      </form>
    </main>
  );
}
