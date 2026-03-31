"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createSlotAction(formData: FormData) {
  const salonId = Number(formData.get("salonId"));
  const serviceId = Number(formData.get("serviceId"));
  const startTime = String(formData.get("startTime"));
  const discountPercent = Number(formData.get("discountPercent"));
  const price = Number(formData.get("price"));

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !startTime) {
    return { ok: false };
  }

  const start = new Date(startTime);

  await prisma.dealSlot.create({
    data: {
      salonId,
      serviceId,
      startTime: start,
      endTime: new Date(start.getTime() + service.durationMin * 60000),
      discountPercent,
      price,
    },
  });

  revalidatePath("/salon");
  revalidatePath("/");
  return { ok: true };
}

export async function updateSlotStatusAction(formData: FormData) {
  const slotId = Number(formData.get("slotId"));
  const status = String(formData.get("status"));

  if (!slotId || !status) {
    return { ok: false };
  }

  await prisma.dealSlot.update({ where: { id: slotId }, data: { status } });
  revalidatePath("/salon");
  return { ok: true };
}
