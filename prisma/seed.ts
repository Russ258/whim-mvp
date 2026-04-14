import { PrismaClient } from "@prisma/client";
import { addMinutes } from "date-fns";

const prisma = new PrismaClient();

function slot(hoursFromNow: number): Date {
  return addMinutes(new Date(), hoursFromNow * 60);
}

async function main() {
  await prisma.booking.deleteMany();
  await prisma.dealSlot.deleteMany();
  await prisma.service.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.salon.deleteMany();

  // ── Salons ────────────────────────────────────────────────────────────────
  const salonData = [
    {
      name: "Strand Studio",
      description: "Award-winning stylists in the heart of Newtown. Specialists in lived-in colour, cuts, and restorative treatments.",
      city: "Sydney",
      address: "312 King St, Newtown",
      category: "HAIR",
      rating: 4.9,
      distanceKm: 0.3,
      email: "hello@strandstudio.com.au",
      phone: "+61411000001",
      heroImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "The Cut Room",
      description: "Relaxed, no-judgment salon on King St. Great for cuts, colour, and everything in between.",
      city: "Sydney",
      address: "189 King St, Newtown",
      rating: 4.8,
      distanceKm: 0.5,
      heroImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Velvet Hair Co.",
      description: "Boutique salon in Enmore. Known for smoothing treatments, glossing, and bond therapy.",
      city: "Sydney",
      address: "67 Enmore Rd, Enmore",
      rating: 4.8,
      distanceKm: 0.8,
      heroImage: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Bloom & Shear",
      description: "Women-first salon in Erskineville. Curl specialists and blow-dry bar.",
      city: "Sydney",
      address: "14 Australia St, Erskineville",
      rating: 4.7,
      distanceKm: 1.2,
      heroImage: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Raw & Co.",
      description: "Marrickville's most-loved independent salon. Fashion colour and editorial finishes.",
      city: "Sydney",
      address: "242 Marrickville Rd, Marrickville",
      rating: 4.6,
      distanceKm: 1.9,
      heroImage: "https://images.unsplash.com/photo-1595163153849-e5d9e9e6e5de?auto=format&fit=crop&w=1200&q=80",
    },
    {
      name: "Polished & Pinned",
      description: "Updo specialists and everyday styling in Glebe. Luxe results without the price tag.",
      city: "Sydney",
      address: "88 Glebe Point Rd, Glebe",
      rating: 4.7,
      distanceKm: 2.4,
      heroImage: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const salons = await Promise.all(
    salonData.map((s) => prisma.salon.create({ data: s }))
  );

  // ── 3 service tiers per salon ─────────────────────────────────────────────
  // QUICK  — trim, blowout, toner         ~45 min   $60–90
  // FULL   — cut + colour, highlights     ~90 min   $100–160
  // PREMIUM — balayage, treatment, perms  ~150 min  $180–280

  const tierConfigs = [
    { tier: "QUICK",   name: "Quick Appointment",   durationMin: 45,  basePrice: 75  },
    { tier: "FULL",    name: "Full Appointment",    durationMin: 90,  basePrice: 130 },
    { tier: "PREMIUM", name: "Premium Appointment", durationMin: 150, basePrice: 230 },
  ]

  // Small per-salon variation in base prices
  const priceVariation = [0, -5, 10, -10, 5, -5]

  const servicesBySalon: { [salonId: number]: { [tier: string]: Awaited<ReturnType<typeof prisma.service.create>> } } = {}

  for (let i = 0; i < salons.length; i++) {
    const salon = salons[i]
    servicesBySalon[salon.id] = {}
    for (const tc of tierConfigs) {
      const svc = await prisma.service.create({
        data: {
          name: tc.name,
          tier: tc.tier,
          durationMin: tc.durationMin,
          basePrice: tc.basePrice + priceVariation[i],
          salonId: salon.id,
        },
      })
      servicesBySalon[salon.id][tc.tier] = svc
    }
  }

  // ── Deal slots ────────────────────────────────────────────────────────────
  // Mix of tiers and times spread over the next ~8 hours
  const slotData = [
    // Strand Studio
    { salonIdx: 0, tier: "QUICK",   hoursFromNow: 0.5,  discount: 30 },
    { salonIdx: 0, tier: "FULL",    hoursFromNow: 2.0,  discount: 25 },
    { salonIdx: 0, tier: "PREMIUM", hoursFromNow: 4.5,  discount: 20 },

    // The Cut Room
    { salonIdx: 1, tier: "QUICK",   hoursFromNow: 1.0,  discount: 35 },
    { salonIdx: 1, tier: "FULL",    hoursFromNow: 3.0,  discount: 20 },
    { salonIdx: 1, tier: "QUICK",   hoursFromNow: 6.0,  discount: 30 },

    // Velvet Hair Co.
    { salonIdx: 2, tier: "PREMIUM", hoursFromNow: 0.75, discount: 25 },
    { salonIdx: 2, tier: "QUICK",   hoursFromNow: 2.5,  discount: 40 },
    { salonIdx: 2, tier: "FULL",    hoursFromNow: 5.0,  discount: 25 },

    // Bloom & Shear
    { salonIdx: 3, tier: "FULL",    hoursFromNow: 1.5,  discount: 30 },
    { salonIdx: 3, tier: "QUICK",   hoursFromNow: 3.5,  discount: 35 },
    { salonIdx: 3, tier: "PREMIUM", hoursFromNow: 7.0,  discount: 20 },

    // Raw & Co.
    { salonIdx: 4, tier: "QUICK",   hoursFromNow: 0.5,  discount: 40 },
    { salonIdx: 4, tier: "FULL",    hoursFromNow: 2.0,  discount: 30 },
    { salonIdx: 4, tier: "PREMIUM", hoursFromNow: 4.0,  discount: 20 },

    // Polished & Pinned
    { salonIdx: 5, tier: "QUICK",   hoursFromNow: 1.0,  discount: 30 },
    { salonIdx: 5, tier: "FULL",    hoursFromNow: 3.0,  discount: 25 },
    { salonIdx: 5, tier: "QUICK",   hoursFromNow: 6.5,  discount: 35 },
  ];

  await Promise.all(
    slotData.map(({ salonIdx, tier, hoursFromNow, discount }) => {
      const salon = salons[salonIdx]
      const svc = servicesBySalon[salon.id][tier]
      const startTime = slot(hoursFromNow)
      return prisma.dealSlot.create({
        data: {
          salonId: salon.id,
          serviceId: svc.id,
          startTime,
          endTime: addMinutes(startTime, svc.durationMin),
          discountPercent: discount,
          price: Math.round(svc.basePrice * (1 - discount / 100)),
        },
      })
    })
  );

  await prisma.promoCode.createMany({
    data: [
      { code: "WHIM20",    description: "20% off your first booking", discountPercent: 20 },
      { code: "NEWTOWN15", description: "15% off at any Newtown salon", discountPercent: 15 },
      { code: "REFER50",   description: "Referral reward — $50 credit", discountPercent: 50 },
    ],
  });

  await prisma.notificationPreference.create({
    data: { email: "demo@whim.app", wantsPush: true, wantsSms: false },
  });

  console.log("✓ Seeded 6 salons · 3 tiers each · 18 slots.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
