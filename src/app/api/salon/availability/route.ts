import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const { salonId, serviceId, dayOfWeek, startHour, endHour } = await req.json();

  if (
    salonId == null || serviceId == null || dayOfWeek == null ||
    startHour == null || endHour == null || startHour >= endHour
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const window = await prisma.availabilityWindow.create({
    data: { salonId, serviceId, dayOfWeek, startHour, endHour },
    include: { service: true },
  });

  revalidatePath("/salon");
  return NextResponse.json({ ok: true, window });
}

export async function DELETE(req: NextRequest) {
  const { windowId, salonId } = await req.json();

  if (!windowId || !salonId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const window = await prisma.availabilityWindow.findUnique({ where: { id: windowId } });

  if (!window || window.salonId !== salonId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.availabilityWindow.delete({ where: { id: windowId } });
  revalidatePath("/salon");
  return NextResponse.json({ ok: true });
}
