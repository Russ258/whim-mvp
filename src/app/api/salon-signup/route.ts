import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { salonName, contactName, email, phone, address, notes } = body as {
    salonName?: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
  };

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[salon-signup] No RESEND_API_KEY set — logging submission only", {
      salonName,
      contactName,
      email,
      phone,
      address,
      notes,
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const resend = new Resend(apiKey);
    const fromEmail = process.env.FROM_EMAIL ?? "bookings@whim.au";

    await resend.emails.send({
      from: `Whim <${fromEmail}>`,
      to: "hello@whim.au",
      subject: `New salon signup: ${salonName ?? "Unknown salon"}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px;background:#fdf0f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:540px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(232,130,154,0.2);">
    <div style="background:linear-gradient(135deg,#e8829a,#c9b3d9);padding:28px;color:#fff;">
      <div style="font-size:13px;opacity:0.8;margin-bottom:4px;">New salon signup via whim.au</div>
      <div style="font-size:26px;font-weight:800;">${salonName ?? "Unknown salon"}</div>
    </div>
    <div style="padding:28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;width:38%;vertical-align:top;">Salon name</td>
          <td style="padding:10px 0;font-size:14px;color:#3d2c35;font-weight:600;">${salonName ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Contact name</td>
          <td style="padding:10px 0;font-size:14px;color:#3d2c35;font-weight:600;">${contactName ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Email</td>
          <td style="padding:10px 0;font-size:14px;color:#3d2c35;font-weight:600;">
            <a href="mailto:${email}" style="color:#e8829a;">${email ?? "—"}</a>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Phone</td>
          <td style="padding:10px 0;font-size:14px;color:#3d2c35;font-weight:600;">${phone ?? "—"}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Address</td>
          <td style="padding:10px 0;font-size:14px;color:#3d2c35;font-weight:600;">${address ?? "—"}</td>
        </tr>
        ${notes ? `
        <tr>
          <td style="padding:10px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Notes</td>
          <td style="padding:10px 0;font-size:14px;color:#3d2c35;">${notes}</td>
        </tr>` : ""}
      </table>
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
    console.error("[salon-signup] Resend error:", err);
    // Don't crash — log and return ok
  }

  return NextResponse.json({ ok: true });
}
