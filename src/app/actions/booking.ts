"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

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

  console.log(
    `📧 [email-stub] Confirmation -> ${input.customerEmail} booked ${slot.service.name} @ ${slot.salon.name} for ${slot.startTime.toISOString()}`,
  );

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
