export function ConsumerHero() {
  return (
    <section className="card-surface mb-6 rounded-3xl p-6 text-charcoal shadow-2xl lg:flex lg:items-center lg:gap-10">
      <div className="flex-1 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-coral">
          Whim Concierge
        </p>
        <h1 className="font-display text-4xl text-charcoal sm:text-5xl">
          Same-day salon bliss, unlocked.
        </h1>
        <p className="text-lg text-muted">
          We rescue last-minute cancellations from Sydney&apos;s top salons so you can book
          a luxe treatment in just two taps.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-coral px-6 py-3 text-base font-semibold text-white shadow-lg shadow-coral/40">
            Claim a slot
          </button>
          <button className="rounded-full border border-charcoal/20 px-5 py-3 text-charcoal hover:border-charcoal/40">
            How Whim works
          </button>
        </div>
      </div>
      <div className="mt-6 grid flex-1 grid-cols-2 gap-3 text-center text-sm text-muted lg:mt-0">
        {["Luminous Locks", "Mint & Shear", "Coral Comb"].map((salon) => (
          <div key={salon} className="rounded-2xl bg-white/60 px-3 py-4">
            <p className="text-xs uppercase tracking-widest text-muted">Trusted by</p>
            <p className="text-lg font-semibold text-charcoal">{salon}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
