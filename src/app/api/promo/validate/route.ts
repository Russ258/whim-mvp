import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase().trim()
  const email = req.nextUrl.searchParams.get('email')?.toLowerCase().trim()

  if (!code) {
    return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 })
  }

  const promo = await prisma.promoCode.findUnique({
    where: { code },
  })

  if (!promo || !promo.active) {
    return NextResponse.json({ valid: false, error: 'Invalid or expired code' })
  }

  // If the code looks like an early-access code, verify it belongs to this email
  if (code.startsWith('EARLY-') && email) {
    const waitlistEntry = await prisma.waitlistEntry.findFirst({
      where: { promoCode: code },
    })
    if (waitlistEntry && waitlistEntry.email !== email) {
      return NextResponse.json({ valid: false, error: 'This code is registered to a different email' })
    }
  }

  return NextResponse.json({
    valid: true,
    discountPercent: promo.discountPercent,
    description: promo.description ?? `${promo.discountPercent}% off`,
  })
}
