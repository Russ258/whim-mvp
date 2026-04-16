import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function makeSignature(slotId: number): string {
  const secret = process.env.CANCEL_SECRET ?? "dev-cancel-secret";
  return createHmac("sha256", secret).update(String(slotId)).digest("hex").slice(0, 16);
}

// GET /api/slots/cancel?slotId=X&sig=Y  — one-click cancel from email
export async function GET(req: NextRequest) {
  const slotId = Number(req.nextUrl.searchParams.get("slotId"));
  const sig = req.nextUrl.searchParams.get("sig");

  if (!slotId || !sig) {
    return new Response("Invalid link", { status: 400 });
  }

  const expected = makeSignature(slotId);
  if (sig !== expected) {
    return new Response("Invalid signature", { status: 403 });
  }

  const slot = await prisma.dealSlot.findUnique({ where: { id: slotId } });

  if (!slot) {
    return new Response("Slot not found", { status: 404 });
  }

  if (slot.status !== "AVAILABLE") {
    return new Response(
      `<html><body style="font-family:sans-serif;padding:40px;text-align:center;">
        <h2 style="color:#e8829a;">Already removed</h2>
        <p>This slot has already been cancelled or booked.</p>
        <a href="https://whim.au/salon">Back to dashboard</a>
      </body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }

  await prisma.dealSlot.update({
    where: { id: slotId },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/");
  revalidatePath("/salon");

  return new Response(
    `<html><body style="font-family:sans-serif;padding:40px;text-align:center;background:#fdf0f5;">
      <div style="max-width:400px;margin:0 auto;background:#fff;border-radius:20px;padding:40px;box-shadow:0 4px 20px rgba(61,44,53,0.1);">
        <div style="font-size:36px;font-weight:800;color:#e8829a;margin-bottom:16px;">Whim</div>
        <h2 style="color:#3d2c35;margin-bottom:12px;">Slot cancelled</h2>
        <p style="color:#a08c96;">The slot has been removed from Whim. No new customers can book it.</p>
        <a href="https://whim.au/salon" style="display:inline-block;margin-top:24px;background:#e8829a;color:#fff;padding:12px 28px;border-radius:100px;font-weight:700;text-decoration:none;">Back to dashboard</a>
      </div>
    </body></html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

export function makeCancelUrl(slotId: number): string {
  const appUrl = process.env.APP_URL ?? "https://whim.au";
  return `${appUrl}/api/slots/cancel?slotId=${slotId}&sig=${makeSignature(slotId)}`;
}
