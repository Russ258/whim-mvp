import { NextRequest, NextResponse } from 'next/server'
import { getNotificationPreference } from '@/lib/queries'
import { upsertNotificationPreference } from '@/app/actions/notifications'

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) {
    return NextResponse.json({ error: 'email query param required' }, { status: 400 })
  }
  try {
    const pref = await getNotificationPreference(email)
    return NextResponse.json(pref ?? { wantsPush: true, wantsSms: false })
  } catch (err) {
    console.error('[api/notifications GET]', err)
    return NextResponse.json({ error: 'Failed to fetch preferences' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email: string; wantsPush: boolean; wantsSms: boolean }
    if (!body.email) {
      return NextResponse.json({ error: 'email required' }, { status: 400 })
    }
    const result = await upsertNotificationPreference(body)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/notifications POST]', err)
    return NextResponse.json({ error: 'Failed to update preferences' }, { status: 500 })
  }
}
