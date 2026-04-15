import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };

  if (!email) {
    return NextResponse.json({ ok: true }); // Don't reveal anything
  }

  const account = await prisma.salonAccount.findUnique({
    where: { email },
    include: { salon: true },
  });

  if (!account) {
    // Don't reveal whether email exists
    return NextResponse.json({ ok: true });
  }

  // Generate new token, set expiry to 7 days
  const loginToken = randomBytes(32).toString("hex");
  const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.salonAccount.update({
    where: { email },
    data: { loginToken, tokenExpiry },
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const fromEmail = process.env.FROM_EMAIL ?? "bookings@whim.au";
      const loginUrl = `https://whim.au/salon/login?token=${loginToken}`;

      await resend.emails.send({
        from: `Whim <${fromEmail}>`,
        to: email,
        subject: "Your Whim salon login link",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#fdf0f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:540px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(232,130,154,0.2);">
    <div style="background:linear-gradient(135deg,#e8829a,#c9b3d9);padding:28px;color:#fff;text-align:center;">
      <div style="font-size:30px;font-weight:800;">Whim</div>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 12px;font-size:22px;color:#3d2c35;">Your login link</h2>
      <p style="color:#a08c96;line-height:1.6;margin:0 0 24px;">
        Click the button below to access your Whim salon dashboard for <strong>${account.salon.name}</strong>.
        The link is valid for 7 days.
      </p>
      <div style="text-align:center;margin:24px 0;">
        <a href="${loginUrl}"
           style="display:inline-block;background:#e8829a;color:#fff;text-decoration:none;
                  padding:14px 32px;border-radius:100px;font-weight:700;font-size:15px;
                  box-shadow:0 4px 14px rgba(232,130,154,0.35);">
          Go to my dashboard →
        </a>
      </div>
      <p style="color:#c4b0b8;font-size:12px;margin:0;text-align:center;">
        Or copy: <a href="${loginUrl}" style="color:#e8829a;">${loginUrl}</a>
      </p>
    </div>
    <div style="background:#fdf6f9;padding:14px 24px;text-align:center;border-top:1px solid rgba(232,130,154,0.12);">
      <div style="font-size:11px;color:#c4b0b8;">Whim · Sydney · whim.au</div>
    </div>
  </div>
</body>
</html>
        `,
      });
    } catch (err) {
      console.error("[send-magic-link] Resend error:", err);
    }
  } else {
    console.log("[send-magic-link] No RESEND_API_KEY — login URL:", `https://whim.au/salon/login?token=${loginToken}`);
  }

  return NextResponse.json({ ok: true });
}
