/**
 * Whim notification service
 * Sends email (Resend) + SMS (Twilio) on booking events.
 *
 * Required env vars:
 *   RESEND_API_KEY       — from resend.com
 *   TWILIO_ACCOUNT_SID  — from twilio.com console
 *   TWILIO_AUTH_TOKEN   — from twilio.com console
 *   TWILIO_FROM_NUMBER  — your Twilio phone number e.g. +61412345678
 *   FROM_EMAIL          — e.g. bookings@whim.au
 *   APP_URL             — e.g. https://whim.au
 */

import { Resend } from 'resend'
import twilio from 'twilio'
import { makeCancelUrl } from '@/app/api/slots/cancel/route'

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-AU', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Australia/Sydney',
  })
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Australia/Sydney',
  })
}

// ── Email ─────────────────────────────────────────────────────────────────────

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

function getFromEmail(): string {
  return process.env.FROM_EMAIL ?? 'bookings@whim.au'
}

function getAppUrl(): string {
  return process.env.APP_URL ?? 'http://localhost:3000'
}

/** Email to customer confirming their booking */
async function sendCustomerConfirmationEmail(params: {
  customerEmail: string
  customerName: string
  salonName: string
  salonAddress: string
  startTime: Date
  endTime: Date
  discountPercent: number
  promoDiscountPct?: number
  appliedPromoCode?: string
  serviceName: string
  voucherCode: string
  notes: string | null
}) {
  const resend = getResend()
  if (!resend) {
    console.log('[email-stub] No RESEND_API_KEY — skipping customer email')
    return
  }

  const redeemUrl = `${getAppUrl()}/redeem`

  await resend.emails.send({
    from: `Whim <${getFromEmail()}>`,
    to: params.customerEmail,
    subject: `Your Whim booking at ${params.salonName} is confirmed`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fdf0f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:480px;margin:32px auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(232,130,154,0.2);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#fce4ec,#fdf0f5);padding:32px 28px 24px;text-align:center;">
      <div style="font-size:36px;font-weight:800;color:#e8829a;letter-spacing:-1px;margin-bottom:8px;">Whim</div>
      <div style="font-size:20px;font-weight:700;color:#3d2c35;">You're booked!</div>
    </div>

    <!-- Body -->
    <div style="padding:28px;">

      <p style="font-size:15px;color:#3d2c35;margin:0 0 24px;">
        Hi ${params.customerName}, your appointment at <strong>${params.salonName}</strong> is confirmed.
      </p>

      <!-- Details -->
      <div style="background:#fdf6f9;border-radius:14px;padding:18px;margin-bottom:20px;border:1px solid rgba(232,130,154,0.15);">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;width:40%;">Salon</td>
            <td style="padding:8px 0;font-size:14px;color:#3d2c35;font-weight:600;">${params.salonName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Address</td>
            <td style="padding:8px 0;font-size:14px;color:#3d2c35;font-weight:600;">${params.salonAddress}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Date</td>
            <td style="padding:8px 0;font-size:14px;color:#3d2c35;font-weight:600;">${formatDate(params.startTime)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Time</td>
            <td style="padding:8px 0;font-size:14px;color:#3d2c35;font-weight:600;">${formatTime(params.startTime)} – ${formatTime(params.endTime)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Service</td>
            <td style="padding:8px 0;font-size:14px;color:#3d2c35;font-weight:600;">${params.serviceName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Slot discount</td>
            <td style="padding:8px 0;font-size:14px;color:#e8829a;font-weight:700;">${params.discountPercent}% off</td>
          </tr>
          ${params.promoDiscountPct ? `
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Promo (${params.appliedPromoCode})</td>
            <td style="padding:8px 0;font-size:14px;color:#e8829a;font-weight:700;">+ ${params.promoDiscountPct}% off</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Total saving</td>
            <td style="padding:8px 0;font-size:20px;color:#e8829a;font-weight:800;">${params.discountPercent + params.promoDiscountPct}% off 🎉</td>
          </tr>` : `
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Total saving</td>
            <td style="padding:8px 0;font-size:20px;color:#e8829a;font-weight:800;">${params.discountPercent}% off</td>
          </tr>`}
          ${params.notes ? `
          <tr>
            <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Your notes</td>
            <td style="padding:8px 0;font-size:14px;color:#3d2c35;">${params.notes}</td>
          </tr>` : ''}
        </table>
      </div>

      <!-- Voucher -->
      <div style="background:#fdf0f5;border-radius:14px;padding:20px;text-align:center;margin-bottom:20px;border:1px solid rgba(232,130,154,0.2);">
        <div style="font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:10px;">Your voucher code</div>
        <div style="font-size:28px;font-weight:800;color:#3d2c35;letter-spacing:4px;">${params.voucherCode}</div>
        <div style="font-size:12px;color:#a08c96;margin-top:8px;">Show this to your stylist when you arrive</div>
      </div>

      <p style="font-size:13px;color:#a08c96;text-align:center;margin:0;">
        Questions? Reply to this email or contact <a href="mailto:hello@whim.au" style="color:#e8829a;">hello@whim.au</a>
      </p>

    </div>

    <!-- Footer -->
    <div style="background:#fdf6f9;padding:16px 28px;text-align:center;border-top:1px solid rgba(232,130,154,0.12);">
      <div style="font-size:11px;color:#c4b0b8;">Whim · Sydney · <a href="${getAppUrl()}" style="color:#e8829a;text-decoration:none;">whim.au</a></div>
    </div>

  </div>
</body>
</html>
    `,
  })
}

/** Email to salon notifying them of a new booking */
async function sendSalonNotificationEmail(params: {
  slotId: number
  salonEmail: string
  salonName: string
  customerName: string
  startTime: Date
  endTime: Date
  discountPercent: number
  serviceName: string
  voucherCode: string
  notes: string | null
}) {
  const resend = getResend()
  if (!resend) {
    console.log('[email-stub] No RESEND_API_KEY — skipping salon email')
    return
  }

  const redeemUrl = `${getAppUrl()}/redeem`
  const cancelUrl = makeCancelUrl(params.slotId)

  await resend.emails.send({
    from: `Whim <${getFromEmail()}>`,
    to: params.salonEmail,
    subject: `New Whim booking — ${params.customerName} at ${formatTime(params.startTime)}`,
    html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#fdf0f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(232,130,154,0.2);">

    <div style="background:#e8829a;padding:24px 28px;">
      <div style="font-size:13px;color:rgba(255,255,255,0.8);margin-bottom:4px;">New booking via Whim</div>
      <div style="font-size:24px;font-weight:800;color:#fff;">${params.customerName}</div>
      <div style="font-size:18px;color:rgba(255,255,255,0.9);margin-top:4px;">${formatTime(params.startTime)} – ${formatTime(params.endTime)}</div>
    </div>

    <div style="padding:24px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;width:40%;">Date</td>
          <td style="padding:8px 0;font-size:14px;color:#3d2c35;font-weight:600;">${formatDate(params.startTime)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Service</td>
          <td style="padding:8px 0;font-size:14px;color:#3d2c35;font-weight:600;">${params.serviceName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Discount</td>
          <td style="padding:8px 0;font-size:18px;color:#e8829a;font-weight:800;">${params.discountPercent}% off</td>
        </tr>
        ${params.notes ? `
        <tr>
          <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Customer notes</td>
          <td style="padding:8px 0;font-size:14px;color:#3d2c35;">${params.notes}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:8px 0;font-size:12px;color:#a08c96;text-transform:uppercase;letter-spacing:0.5px;">Voucher code</td>
          <td style="padding:8px 0;font-size:20px;color:#3d2c35;font-weight:800;letter-spacing:3px;">${params.voucherCode}</td>
        </tr>
      </table>

      <a href="${redeemUrl}" style="display:block;background:#e8829a;color:#fff;text-align:center;padding:16px;border-radius:12px;font-size:15px;font-weight:700;text-decoration:none;margin-top:20px;">
        Open redemption page →
      </a>

      <div style="margin-top:16px;padding:16px;background:#fdf6f9;border-radius:12px;border:1px solid rgba(232,130,154,0.12);">
        <p style="font-size:13px;color:#3d2c35;font-weight:600;margin:0 0 6px;">Got a booking from elsewhere for this time?</p>
        <p style="font-size:12px;color:#a08c96;margin:0 0 12px;">Click below to cancel this Whim slot so no one else books it.</p>
        <a href="${cancelUrl}" style="display:inline-block;background:#fff;color:#c0392b;border:1px solid rgba(192,57,43,0.3);padding:10px 20px;border-radius:100px;font-size:13px;font-weight:600;text-decoration:none;">
          Cancel this slot
        </a>
      </div>

      <p style="font-size:11px;color:#c4b0b8;text-align:center;margin-top:16px;">
        Whim charges a flat $10 fee per redeemed booking, invoiced monthly.
      </p>
    </div>

  </div>
</body>
</html>
    `,
  })
}

// ── SMS ───────────────────────────────────────────────────────────────────────

function getTwilioClient(): ReturnType<typeof twilio> | null {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!sid || !token) return null
  return twilio(sid, token)
}

/** SMS to salon — short, time-sensitive alert */
async function sendSalonSms(params: {
  salonPhone: string
  customerName: string
  startTime: Date
  discountPercent: number
  tier: string
  voucherCode: string
}) {
  const client = getTwilioClient()
  if (!client) {
    console.log('[sms-stub] No Twilio credentials — skipping SMS')
    return
  }

  const tierShort: Record<string, string> = {
    QUICK: 'Quick appt', FULL: 'Full appt', PREMIUM: 'Premium appt',
  }

  const body = [
    `New Whim booking!`,
    `${params.customerName} · ${tierShort[params.tier] ?? 'Appt'} · ${formatTime(params.startTime)}`,
    `${params.discountPercent}% off · Voucher: ${params.voucherCode}`,
    `Redeem: whim.au/redeem`,
  ].join('\n')

  await client.messages.create({
    body,
    from: 'Whim',
    to: params.salonPhone,
  })
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface BookingNotificationParams {
  // Slot
  slotId: number
  startTime: Date
  endTime: Date
  discountPercent: number
  serviceName: string
  tier: string
  // Customer
  customerName: string
  customerEmail: string
  notes: string | null
  voucherCode: string
  promoDiscountPct?: number
  appliedPromoCode?: string
  // Salon
  salonName: string
  salonAddress: string
  salonEmail?: string
  salonPhone?: string
}

export async function sendBookingNotifications(params: BookingNotificationParams) {
  const results = await Promise.allSettled([
    // Always send customer confirmation
    sendCustomerConfirmationEmail({
      customerEmail: params.customerEmail,
      customerName: params.customerName,
      salonName: params.salonName,
      salonAddress: params.salonAddress,
      startTime: params.startTime,
      endTime: params.endTime,
      discountPercent: params.discountPercent,
      promoDiscountPct: params.promoDiscountPct,
      appliedPromoCode: params.appliedPromoCode,
      serviceName: params.serviceName,
      voucherCode: params.voucherCode,
      notes: params.notes,
    }),
    // Salon email if we have their address
    params.salonEmail
      ? sendSalonNotificationEmail({
          slotId: params.slotId,
          salonEmail: params.salonEmail,
          salonName: params.salonName,
          customerName: params.customerName,
          startTime: params.startTime,
          endTime: params.endTime,
          discountPercent: params.discountPercent,
          serviceName: params.serviceName,
          voucherCode: params.voucherCode,
          notes: params.notes,
        })
      : Promise.resolve(),
    // Salon SMS if we have their number
    params.salonPhone
      ? sendSalonSms({
          salonPhone: params.salonPhone,
          customerName: params.customerName,
          startTime: params.startTime,
          discountPercent: params.discountPercent,
          tier: params.tier,
          voucherCode: params.voucherCode,
        })
      : Promise.resolve(),
  ])

  // Log any failures without crashing the booking flow
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[notifications] channel ${i} failed:`, r.reason)
    }
  })
}
