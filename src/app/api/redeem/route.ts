import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendReviewRequestEmail } from '@/lib/notifications'

// GET /api/redeem?code=WHM-XXXXXX — look up a voucher
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase().trim()
  if (!code) {
    return NextResponse.json({ error: 'code required' }, { status: 400 })
  }

  const booking = await prisma.booking.findUnique({
    where: { voucherCode: code },
    include: {
      slot: {
        include: { salon: true, service: true },
      },
    },
  })

  if (!booking) {
    return NextResponse.json({ error: 'Voucher not found' }, { status: 404 })
  }

  return NextResponse.json({
    id: booking.id,
    voucherCode: booking.voucherCode,
    customerName: booking.customerName,
    notes: booking.notes,
    status: booking.status,
    redeemedAt: booking.redeemedAt,
    slot: {
      startTime: booking.slot.startTime,
      endTime: booking.slot.endTime,
      discountPercent: booking.slot.discountPercent,
      salon: {
        name: booking.slot.salon.name,
        address: booking.slot.salon.address,
      },
      service: {
        tier: booking.slot.service.tier,
        durationMin: booking.slot.service.durationMin,
      },
    },
  })
}

// POST /api/redeem — mark a voucher as redeemed
export async function POST(req: NextRequest) {
  const { code } = await req.json() as { code: string }
  if (!code) {
    return NextResponse.json({ error: 'code required' }, { status: 400 })
  }

  const booking = await prisma.booking.findUnique({
    where: { voucherCode: code.toUpperCase().trim() },
    include: { slot: { include: { salon: true } } },
  })

  if (!booking) {
    return NextResponse.json({ error: 'Voucher not found' }, { status: 404 })
  }

  if (booking.redeemedAt) {
    return NextResponse.json(
      { error: 'Voucher already redeemed', redeemedAt: booking.redeemedAt },
      { status: 409 }
    )
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { redeemedAt: new Date(), status: 'REDEEMED' },
  })

  // Fire review request email — don't await so redemption isn't delayed
  sendReviewRequestEmail({
    customerEmail: booking.customerEmail,
    customerName: booking.customerName,
    salonName: booking.slot.salon.name,
    voucherCode: booking.voucherCode,
  }).catch((e) => console.error('[review-email]', e))

  return NextResponse.json({ ok: true, redeemedAt: updated.redeemedAt })
}
