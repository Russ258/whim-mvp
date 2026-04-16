"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export async function approveSalonApplication(applicationId: number) {
  const application = await prisma.salonApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    return { ok: false, message: "Application not found" };
  }

  // Create the Salon record
  const salon = await prisma.salon.create({
    data: {
      name: application.salonName,
      description: `${application.salonName} — Whim salon partner`,
      city: application.address,
      address: application.address,
      email: application.email,
      phone: application.phone,
      distanceKm: 0,
    },
  });

  // Generate login token, expiring in 7 days
  const loginToken = generateToken();
  const tokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Create SalonAccount
  await prisma.salonAccount.create({
    data: {
      salonId: salon.id,
      email: application.email,
      loginToken,
      tokenExpiry,
    },
  });

  // Update application status
  await prisma.salonApplication.update({
    where: { id: applicationId },
    data: { status: "APPROVED" },
  });

  // Send approval email
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const fromEmail = process.env.FROM_EMAIL ?? "bookings@whim.au";
      const loginUrl = `https://whim.au/salon/login?token=${loginToken}`;

      await resend.emails.send({
        from: `Whim <${fromEmail}>`,
        to: application.email,
        subject: "Welcome to Whim — your salon dashboard is ready",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#fdf0f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(232,130,154,0.2);">
    <div style="background:linear-gradient(135deg,#e8829a,#c9b3d9);padding:32px;color:#fff;text-align:center;">
      <div style="font-size:32px;font-weight:800;margin-bottom:8px;">Whim</div>
      <div style="font-size:16px;opacity:0.9;">Welcome to the family 🎉</div>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 16px;font-size:24px;color:#3d2c35;">Hi ${application.contactName},</h2>
      <p style="color:#3d2c35;line-height:1.6;margin:0 0 16px;">
        Great news — <strong>${application.salonName}</strong> has been approved as a Whim salon partner!
        Your dashboard is ready and waiting.
      </p>
      <p style="color:#a08c96;line-height:1.6;margin:0 0 16px;">
        Click the button below to access your salon dashboard. Your first step is to add your services
        (e.g. "Women's Cut & Blowdry · $85 · 60 min") — this only takes a minute and lets customers
        see exactly what they're booking.
      </p>
      <p style="color:#a08c96;line-height:1.6;margin:0 0 24px;">
        Once your services are set up, you can start posting last-minute slots in seconds.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${loginUrl}"
           style="display:inline-block;background:#e8829a;color:#fff;text-decoration:none;
                  padding:16px 36px;border-radius:100px;font-weight:700;font-size:16px;
                  box-shadow:0 4px 14px rgba(232,130,154,0.4);">
          Access your dashboard →
        </a>
      </div>
      <p style="color:#a08c96;font-size:13px;line-height:1.6;margin:0 0 8px;">
        The link is valid for 7 days. If it expires, you can request a new one from the login page.
      </p>
      <p style="color:#c4b0b8;font-size:12px;margin:0;">
        Or copy this URL: <a href="${loginUrl}" style="color:#e8829a;">${loginUrl}</a>
      </p>
    </div>
    <div style="background:#fdf6f9;padding:16px 28px;text-align:center;border-top:1px solid rgba(232,130,154,0.12);">
      <div style="font-size:11px;color:#c4b0b8;">Whim · Sydney · whim.au</div>
    </div>
  </div>
</body>
</html>
        `,
      });
    } catch (err) {
      console.error("[salon-admin] Resend approval email error:", err);
    }
  } else {
    console.log("[salon-admin] No RESEND_API_KEY — skipping approval email for", application.email);
  }

  revalidatePath("/admin");
  return { ok: true };
}

export async function declineSalonApplication(applicationId: number) {
  const application = await prisma.salonApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) {
    return { ok: false, message: "Application not found" };
  }

  await prisma.salonApplication.update({
    where: { id: applicationId },
    data: { status: "DECLINED" },
  });

  // Send polite decline email
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      const fromEmail = process.env.FROM_EMAIL ?? "bookings@whim.au";

      await resend.emails.send({
        from: `Whim <${fromEmail}>`,
        to: application.email,
        subject: "Your Whim salon application",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#fdf0f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(232,130,154,0.2);">
    <div style="background:linear-gradient(135deg,#e8829a,#c9b3d9);padding:32px;color:#fff;text-align:center;">
      <div style="font-size:32px;font-weight:800;">Whim</div>
    </div>
    <div style="padding:32px;">
      <h2 style="margin:0 0 16px;font-size:22px;color:#3d2c35;">Hi ${application.contactName},</h2>
      <p style="color:#3d2c35;line-height:1.6;margin:0 0 16px;">
        Thank you for applying to join Whim as a salon partner.
      </p>
      <p style="color:#a08c96;line-height:1.6;margin:0 0 16px;">
        After reviewing your application for <strong>${application.salonName}</strong>, we're not able to move forward at this time.
        We carefully consider each application to ensure the best fit for our platform and customers.
      </p>
      <p style="color:#a08c96;line-height:1.6;margin:0;">
        We appreciate your interest in Whim and wish you and ${application.salonName} all the best.
        If circumstances change, we'd welcome a new application in the future.
      </p>
    </div>
    <div style="background:#fdf6f9;padding:16px 28px;text-align:center;border-top:1px solid rgba(232,130,154,0.12);">
      <div style="font-size:11px;color:#c4b0b8;">Whim · Sydney · whim.au</div>
    </div>
  </div>
</body>
</html>
        `,
      });
    } catch (err) {
      console.error("[salon-admin] Resend decline email error:", err);
    }
  }

  revalidatePath("/admin");
  return { ok: true };
}
