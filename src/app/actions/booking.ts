"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendBookingNotifications } from "@/lib/notifications";

function generateVoucherCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `WHM-${rand}`
}

export async function createBookingAction(input: {
  slotId: number;
  customerName: string;
  customerEmail: string;
  notes?: string;
  cardBrand?: string;
  cardLast4?: string;
}) {
  const slot = await prisma.dealSlot.findUnique({
    where: { id: input.slotId },
    include: { salon: true, service: true },
  });

  if (!slot) {
    return { ok: false, message: "Slot no longer exists" };
  }

  if (slot.status !== "AVAILABLE") {
    return { ok: false, message: "Slot already booked" };
  }

  const booking = await prisma.booking.create({
    data: {
      slotId: slot.id,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      notes: input.notes,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      voucherCode: generateVoucherCode(),
    },
    include: {
      slot: {
        include: {
          salon: true,
          service: true,
        },
      },
    },
  });

  await prisma.dealSlot.update({
    where: { id: slot.id },
    data: { status: "BOOKED" },
  });

  // Fire notifications — don't await so booking response isn't delayed
  sendBookingNotifications({
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    notes: input.notes ?? null,
    voucherCode: booking.voucherCode,
    startTime: slot.startTime,
    endTime: slot.endTime,
    discountPercent: slot.discountPercent,
    tier: slot.service.tier,
    salonName: slot.salon.name,
    salonAddress: slot.salon.address,
    salonEmail: slot.salon.email ?? undefined,
    salonPhone: slot.salon.phone ?? undefined,
  }).catch((e) => console.error('[notifications] unexpected error:', e))

  revalidatePath("/");
  revalidatePath("/bookings");
  return { ok: true, booking };
}

export async function updateBookingStatusAction(formData: FormData) {
  const bookingId = Number(formData.get("bookingId"));
  const status = String(formData.get("status"));
  const paymentStatus = String(formData.get("paymentStatus"));

  if (!bookingId || !status) {
    return { ok: false };
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status,
      paymentStatus,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/salon");
  revalidatePath("/bookings");
  return { ok: true, booking };
}
