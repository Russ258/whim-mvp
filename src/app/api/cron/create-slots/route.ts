import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { urgencyDiscount } from "@/lib/urgency";

// Vercel sets Authorization: Bearer <CRON_SECRET> on cron requests
function isAuthorised(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // dev: allow without secret
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Work in Sydney time
  const sydneyNow = new Date(
    new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })
  );
  const todayDow = sydneyNow.getDay(); // 0=Sun…6=Sat
  const todayDateStr = sydneyNow.toLocaleDateString("en-CA", {
    timeZone: "Australia/Sydney",
  }); // YYYY-MM-DD

  const windows = await prisma.availabilityWindow.findMany({
    where: { dayOfWeek: todayDow, active: true },
    include: { service: true },
  });

  let created = 0;
  let skipped = 0;

  for (const window of windows) {
    const { salonId, serviceId, startHour, endHour, service } = window;
    const slotDurationHours = Math.max(1, Math.ceil(service.durationMin / 60));

    // Generate one slot per duration block within the window
    for (let hour = startHour; hour + slotDurationHours <= endHour; hour += slotDurationHours) {
      const startTime = new Date(`${todayDateStr}T${String(hour).padStart(2, "0")}:00:00+10:00`);
      const endTime = new Date(startTime.getTime() + service.durationMin * 60_000);

      // Skip if slot already exists for this salon/service/time today
      const exists = await prisma.dealSlot.findFirst({
        where: { salonId, serviceId, startTime },
      });

      if (exists) {
        skipped++;
        continue;
      }

      await prisma.dealSlot.create({
        data: {
          salonId,
          serviceId,
          startTime,
          endTime,
          discountPercent: urgencyDiscount(startTime),
          price: 0,
          status: "AVAILABLE",
        },
      });
      created++;
    }
  }

  return NextResponse.json({ ok: true, created, skipped, date: todayDateStr });
}
