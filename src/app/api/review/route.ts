import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/review
export async function POST(req: NextRequest) {
  const body = await req.json() as {
    voucherCode: string
    overallRating: number
    valueRating: number
    repeatRating: number
  }

  const { voucherCode, overallRating, valueRating, repeatRating } = body

  if (!voucherCode || !overallRating || !valueRating || !repeatRating) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  const isValid = (n: number) => Number.isInteger(n) && n >= 1 && n <= 5
  if (!isValid(overallRating) || !isValid(valueRating) || !isValid(repeatRating)) {
    return NextResponse.json({ error: 'Ratings must be 1–5' }, { status: 400 })
  }

  const booking = await prisma.booking.findUnique({
    where: { voucherCode: voucherCode.toUpperCase().trim() },
    include: { slot: { include: { salon: true } } },
  })

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  // Only allow reviews after redemption
  if (!booking.redeemedAt) {
    return NextResponse.json({ error: 'Booking has not been redeemed yet' }, { status: 400 })
  }

  // One review per booking
  const existing = await prisma.review.findUnique({ where: { bookingId: booking.id } })
  if (existing) {
    return NextResponse.json({ ok: true, alreadyReviewed: true })
  }

  await prisma.review.create({
    data: {
      bookingId: booking.id,
      salonId: booking.slot.salonId,
      customerEmail: booking.customerEmail,
      overallRating,
      valueRating,
      repeatRating,
    },
  })

  return NextResponse.json({ ok: true })
}
