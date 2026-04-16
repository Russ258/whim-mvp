import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Derive tier from duration so salons don't need to think about it
function tierFromDuration(durationMin: number): string {
  if (durationMin <= 45) return "QUICK";
  if (durationMin <= 90) return "FULL";
  return "PREMIUM";
}

export async function POST(req: NextRequest) {
  const { salonId, name, basePrice, durationMin } = await req.json();

  if (!salonId || !name || !basePrice || !durationMin) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      salonId,
      name: name.trim(),
      basePrice: Math.round(Number(basePrice)),
      durationMin: Number(durationMin),
      tier: tierFromDuration(Number(durationMin)),
    },
  });

  revalidatePath("/salon");
  return NextResponse.json({ ok: true, service });
}

export async function DELETE(req: NextRequest) {
  const { serviceId, salonId } = await req.json();

  if (!serviceId || !salonId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Safety check — only delete if it belongs to this salon and has no live slots
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { slots: { where: { status: "AVAILABLE" } } },
  });

  if (!service || service.salonId !== salonId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (service.slots.length > 0) {
    return NextResponse.json(
      { error: "Cancel all live slots for this service before deleting it" },
      { status: 409 }
    );
  }

  await prisma.service.delete({ where: { id: serviceId } });
  revalidatePath("/salon");
  return NextResponse.json({ ok: true });
}
