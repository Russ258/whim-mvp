import { NextRequest, NextResponse } from 'next/server'
import { getConsumerBookings } from '@/lib/queries'
import { createBookingAction } from '@/app/actions/booking'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'email query param required' }, { status: 400 })
  }
  try {
    const bookings = await getConsumerBookings(email)
    return NextResponse.json(bookings)
  } catch (err) {
    console.error('[api/bookings GET]', err)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      slotId: number
      customerName: string
      customerEmail: string
      notes?: string
      cardBrand?: string
      cardLast4?: string
    }

    if (!body.slotId || !body.customerName || !body.customerEmail) {
      return NextResponse.json({ error: 'slotId, customerName, customerEmail required' }, { status: 400 })
    }

    const result = await createBookingAction(body)
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 409 })
    }
    return NextResponse.json(result.booking, { status: 201 })
  } catch (err) {
    console.error('[api/bookings POST]', err)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
