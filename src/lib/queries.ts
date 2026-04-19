import { prisma } from "./prisma";

export async function getLiveDeals() {
  const now = new Date();
  return prisma.dealSlot.findMany({
    where: {
      status: "AVAILABLE",
      startTime: {
        gte: now,
      },
    },
    include: {
      salon: true,
      service: true,
    },
    orderBy: {
      startTime: "asc",
    },
    take: 20,
  });
}

export async function getConsumerBookings(email: string) {
  return prisma.booking.findMany({
    where: { customerEmail: email },
    include: {
      slot: {
        include: {
          salon: true,
          service: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSavedCards(email: string) {
  return prisma.paymentMethod.findMany({
    where: { customerEmail: email },
    orderBy: { primary: "desc" },
  });
}

export async function getNotificationPreference(email: string) {
  return prisma.notificationPreference.findFirst({ where: { email } });
}

export async function getSalons() {
  return prisma.salon.findMany({
    include: {
      services: true,
      slots: {
        where: { status: "AVAILABLE" },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function getSalonDashboardPayload(salonId: number) {
  const salon = await prisma.salon.findUnique({
    where: { id: salonId },
    include: {
      services: true,
      slots: {
        where: {
          startTime: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
        include: {
          service: true,
          bookings: true,
        },
        orderBy: { startTime: "asc" },
      },
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filledSlots = salon?.slots.filter((slot) => slot.status !== "AVAILABLE").length ?? 0;
  const revenue = salon?.slots.reduce((acc, slot) => {
    const isBooked = slot.status === "BOOKED" || slot.bookings.length > 0;
    return isBooked ? acc + slot.price : acc;
  }, 0);

  return {
    salon,
    filledSlots,
    revenue,
  };
}

export async function getSalonByAccount(salonId: number) {
  const now = new Date();
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const salon = await prisma.salon.findUnique({
    where: { id: salonId },
    include: {
      services: true,
      slots: {
        include: {
          service: true,
          bookings: true,
        },
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!salon) return null;

  const todaysSlots = salon.slots.filter(
    (slot) => slot.startTime >= todayStart && slot.startTime <= todayEnd
  );

  const todaysBookings = todaysSlots.flatMap((slot) =>
    slot.bookings.map((booking) => ({ ...booking, slot }))
  );

  const liveSlots = salon.slots.filter(
    (slot) => slot.status === "AVAILABLE" && slot.startTime >= now
  );

  // Monthly redeemed bookings
  const monthlyRedeemed = await prisma.booking.count({
    where: {
      redeemedAt: { gte: monthStart },
      slot: { salonId },
    },
  });

  return {
    salon,
    todaysBookings,
    liveSlots,
    monthlyRedeemed,
  };
}

export async function getAdminSnapshot() {
  const [salons, services, bookings, promoCodes] = await Promise.all([
    getSalons(),
    prisma.service.findMany({ include: { salon: true }, orderBy: { id: "asc" } }),
    prisma.booking.findMany({
      include: { slot: { include: { salon: true, service: true } } },
      orderBy: { createdAt: "desc" },
      take: 15,
    }),
    prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return { salons, services, bookings, promoCodes };
}

export async function getSalonApplications() {
  return prisma.salonApplication.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAdminBookings() {
  return prisma.booking.findMany({
    include: { slot: { include: { salon: true, service: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export async function getWaitlistEntries() {
  return prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
  });
}
