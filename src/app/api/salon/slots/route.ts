import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const { salonId, serviceId, startTime, discountPercent, tier } = await req.json();

  if (!salonId || !serviceId || !startTime || !discountPercent) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const start = new Date(startTime);
  const end = new Date(start.getTime() + service.durationMin * 60000);

  const slot = await prisma.dealSlot.create({
    data: {
      salonId,
      serviceId,
      startTime: start,
      endTime: end,
      discountPercent,
      price: 0, // Price not shown to customers — discount % is the hero
    },
  });

  revalidatePath("/salon");
  revalidatePath("/");

  return NextResponse.json({ ok: true, slotId: slot.id });
}
