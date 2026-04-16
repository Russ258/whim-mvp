import { NextResponse } from 'next/server'
import { getLiveDeals } from '@/lib/queries'
import { urgencyDiscount } from '@/lib/urgency'

export async function GET() {
  try {
    const deals = await getLiveDeals()

    // Override stored discount with live urgency pricing
    const withUrgency = deals.map((deal) => ({
      ...deal,
      discountPercent: urgencyDiscount(deal.startTime),
    }))

    return NextResponse.json(withUrgency)
  } catch (err) {
    console.error('[api/deals]', err)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}
