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
