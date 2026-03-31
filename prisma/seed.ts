import { PrismaClient } from "@prisma/client";
import { addMinutes } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  await prisma.booking.deleteMany();
  await prisma.dealSlot.deleteMany();
  await prisma.service.deleteMany();
  await prisma.salon.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.promoCode.deleteMany();
  await prisma.paymentMethod.deleteMany();

  const now = new Date();

  const salons = await Promise.all(
    [
      {
        name: "Luminous Locks",
        description: "Award-winning stylists specialising in lived-in colour and glass finishes.",
        city: "Sydney",
        address: "14 Crown St, Surry Hills",
        rating: 4.9,
        distanceKm: 1.4,
        heroImage:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Mint & Shear",
        description: "Fresh fades, scalp rituals, and restorative treatments in a calm oasis.",
        city: "Sydney",
        address: "88 Bayswater Rd, Darlinghurst",
        rating: 4.7,
        distanceKm: 2.1,
        heroImage:
          "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
      },
      {
        name: "Coral Comb Studio",
        description: "Express blow-dries and editorial styling crafted for busy creatives.",
        city: "Sydney",
        address: "231 Harris St, Pyrmont",
        rating: 4.8,
        distanceKm: 3.3,
        heroImage:
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
      },
    ].map((salon) =>
      prisma.salon.create({
        data: salon,
      })
    )
  );

  const services = await Promise.all(
    [
      {
        name: "Express Blowdry",
        durationMin: 45,
        basePrice: 120,
        salonId: salons[0].id,
      },
      {
        name: "Restorative Treatment + Cut",
        durationMin: 70,
        basePrice: 210,
        salonId: salons[0].id,
      },
      {
        name: "Gloss Toner Refresh",
        durationMin: 50,
        basePrice: 180,
        salonId: salons[1].id,
      },
      {
        name: "Precision Fade",
        durationMin: 40,
        basePrice: 95,
        salonId: salons[1].id,
      },
      {
        name: "Editorial Waves",
        durationMin: 60,
        basePrice: 160,
        salonId: salons[2].id,
      },
      {
        name: "Hydrating Scalp Facial",
        durationMin: 55,
        basePrice: 190,
        salonId: salons[2].id,
      },
    ].map((service) => prisma.service.create({ data: service }))
  );

  const slots = await Promise.all(
    [
      {
        service: services[0],
        salon: salons[0],
        offsetMinutes: 30,
        discountPercent: 25,
      },
      {
        service: services[1],
        salon: salons[0],
        offsetMinutes: 120,
        discountPercent: 35,
      },
      {
        service: services[2],
        salon: salons[1],
        offsetMinutes: 75,
        discountPercent: 20,
      },
      {
        service: services[3],
        salon: salons[1],
        offsetMinutes: 180,
        discountPercent: 30,
      },
      {
        service: services[4],
        salon: salons[2],
        offsetMinutes: 240,
        discountPercent: 18,
      },
      {
        service: services[5],
        salon: salons[2],
        offsetMinutes: 320,
        discountPercent: 40,
      },
    ].map(async ({ service, discountPercent, offsetMinutes }) => {
      const startTime = addMinutes(now, offsetMinutes);
      return prisma.dealSlot.create({
        data: {
          salonId: service.salonId,
          serviceId: service.id,
          startTime,
          endTime: addMinutes(startTime, service.durationMin),
          discountPercent,
          price: Math.round(service.basePrice * (1 - discountPercent / 100)),
        },
        include: { salon: true, service: true },
      });
    })
  );

  await prisma.booking.create({
    data: {
      slotId: slots[0].id,
      customerName: "Harper Bloom",
      customerEmail: "harper@example.com",
      status: "CONFIRMED",
      paymentStatus: "PAID",
    },
  });

  await prisma.booking.create({
    data: {
      slotId: slots[4].id,
      customerName: "Elliot Shore",
      customerEmail: "elliot@example.com",
      status: "PENDING",
      paymentStatus: "PENDING",
    },
  });

  await prisma.notificationPreference.createMany({
    data: [
      { email: "harper@example.com", wantsPush: true, wantsSms: false },
      { email: "elliot@example.com", wantsPush: false, wantsSms: true },
    ],
  });

  await prisma.promoCode.createMany({
    data: [
      { code: "CORAL20", description: "20% off editorial styling", discountPercent: 20 },
      { code: "MINTFRESH", description: "15% off scalp rituals", discountPercent: 15 },
    ],
  });

  await prisma.paymentMethod.createMany({
    data: [
      { customerEmail: "harper@example.com", brand: "Visa", last4: "1882", expiryMonth: 9, expiryYear: 27, primary: true },
      { customerEmail: "harper@example.com", brand: "Amex", last4: "4401", expiryMonth: 2, expiryYear: 28 },
      { customerEmail: "elliot@example.com", brand: "Mastercard", last4: "9910", expiryMonth: 11, expiryYear: 26, primary: true },
    ],
  });

  console.log("Database seeded with salons, slots, bookings, and supporting data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
