import { NextResponse } from 'next/server'
import { getLiveDeals } from '@/lib/queries'

export async function GET() {
  try {
    const deals = await getLiveDeals()
    return NextResponse.json(deals)
  } catch (err) {
    console.error('[api/deals]', err)
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}
