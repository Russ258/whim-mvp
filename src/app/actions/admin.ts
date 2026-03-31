"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createSalonAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const rating = Number(formData.get("rating") ?? 4.6);
  const distanceKm = Number(formData.get("distanceKm") ?? 2);

  if (!name || !city) {
    return { ok: false, message: "Name and city required" };
  }

  await prisma.salon.create({
    data: {
      name,
      city,
      address,
      description,
      rating,
      distanceKm,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/salon");
  revalidatePath("/");
  return { ok: true };
}

export async function createServiceAction(formData: FormData) {
  const salonId = Number(formData.get("salonId"));
  const name = String(formData.get("serviceName") ?? "").trim();
  const durationMin = Number(formData.get("durationMin") ?? 45);
  const basePrice = Number(formData.get("basePrice") ?? 120);

  if (!salonId || !name) {
    return { ok: false, message: "Select a salon and name" };
  }

  await prisma.service.create({
    data: {
      salonId,
      name,
      durationMin,
      basePrice,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/salon");
  return { ok: true };
}

export async function createPromoAction(formData: FormData) {
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const description = String(formData.get("description") ?? "").trim();
  const discountPercent = Number(formData.get("discountPercent") ?? 10);

  if (!code) {
    return { ok: false, message: "Code required" };
  }

  await prisma.promoCode.create({
    data: {
      code,
      description,
      discountPercent,
    },
  });

  revalidatePath("/admin");
  return { ok: true };
}

export async function togglePromoAction(promoId: number, active: boolean) {
  await prisma.promoCode.update({ where: { id: promoId }, data: { active } });
  revalidatePath("/admin");
  return { ok: true };
}
