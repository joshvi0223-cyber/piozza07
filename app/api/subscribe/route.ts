import { NextRequest, NextResponse } from 'next/server'

// In-memory store (resets on server restart — swap for DB in production)
const subscribers = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    const isNew = !subscribers.has(email.toLowerCase())
    subscribers.add(email.toLowerCase())
    return NextResponse.json({
      success: true,
      message: isNew ? 'Subscribed.' : 'Already subscribed.',
      isNew,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
