import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { randomBytes } from "crypto";

const EARLY_ACCESS_LIMIT = 500;

function generatePromoCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "EARLY-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Check if already signed up
  const existing = await prisma.waitlistEntry.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ ok: true, alreadyJoined: true, promoCode: existing.promoCode });
  }

  // Check if within early access limit
  const count = await prisma.waitlistEntry.count();
  const earlyAccess = count < EARLY_ACCESS_LIMIT;

  // Generate unique promo code
  let promoCode = generatePromoCode();
  let attempts = 0;
  while (attempts < 10) {
    const clash = await prisma.waitlistEntry.findUnique({ where: { promoCode } });
    if (!clash) break;
    promoCode = generatePromoCode();
    attempts++;
  }

  const entry = await prisma.waitlistEntry.create({
    data: { email, promoCode, earlyAccess },
  });

  // Also save to PromoCode table so it's usable at booking
  await prisma.promoCode.create({
    data: {
      code: promoCode,
      description: "Early access — 10% off your first Whim booking",
      discountPercent: 10,
      active: true,
    },
  });

  // Send confirmation email
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const fromEmail = process.env.FROM_EMAIL ?? "bookings@whim.au";

      await resend.emails.send({
        from: `Whim <${fromEmail}>`,
        to: email,
        subject: earlyAccess
          ? "You're in — your early access code is here"
          : "You're on the Whim waitlist",
        html: earlyAccess
          ? `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#fdf0f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:540px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(232,130,154,0.2);">
    <div style="background:linear-gradient(135deg,#e8829a,#c9b3d9);padding:28px;color:#fff;text-align:center;">
      <div style="font-size:30px;font-weight:800;letter-spacing:-1px;">Whim</div>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;font-size:22px;color:#3d2c35;">You made the list.</h2>
      <p style="color:#a08c96;line-height:1.6;margin:0 0 24px;">
        You're one of our early members — which means you get <strong>an extra 10% off every booking</strong>, forever.
        Save your personal code below and use it when Whim launches.
      </p>
      <div style="background:#fdf0f5;border-radius:14px;padding:20px;text-align:center;margin-bottom:24px;border:1px solid rgba(232,130,154,0.2);">
        <p style="margin:0 0 6px;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:1px;">Your early access code</p>
        <p style="margin:0;font-size:28px;font-weight:800;color:#e8829a;letter-spacing:3px;">${promoCode}</p>
      </div>
      <p style="color:#a08c96;font-size:13px;line-height:1.6;margin:0;">
        We'll email you the moment Whim goes live in Sydney. In the meantime, follow us on Instagram for sneak peeks.
      </p>
    </div>
    <div style="background:#fdf6f9;padding:14px 24px;text-align:center;border-top:1px solid rgba(232,130,154,0.12);">
      <div style="font-size:11px;color:#c4b0b8;">Whim · Sydney · whim.au</div>
    </div>
  </div>
</body></html>`
          : `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#fdf0f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:540px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(232,130,154,0.2);">
    <div style="background:linear-gradient(135deg,#e8829a,#c9b3d9);padding:28px;color:#fff;text-align:center;">
      <div style="font-size:30px;font-weight:800;letter-spacing:-1px;">Whim</div>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 8px;font-size:22px;color:#3d2c35;">You're on the list.</h2>
      <p style="color:#a08c96;line-height:1.6;margin:0;">
        We'll let you know the moment Whim goes live in Sydney.
      </p>
    </div>
    <div style="background:#fdf6f9;padding:14px 24px;text-align:center;border-top:1px solid rgba(232,130,154,0.12);">
      <div style="font-size:11px;color:#c4b0b8;">Whim · Sydney · whim.au</div>
    </div>
  </div>
</body></html>`,
      });
    } catch (err) {
      console.error("[waitlist] email error:", err);
    }
  }

  return NextResponse.json({
    ok: true,
    promoCode: earlyAccess ? promoCode : null,
    earlyAccess,
    position: count + 1,
  });
}

export async function GET() {
  const count = await prisma.waitlistEntry.count();
  return NextResponse.json({ count });
}
