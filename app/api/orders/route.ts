import { NextRequest, NextResponse } from 'next/server'

export interface OrderPayload {
  customer: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  delivery: {
    street: string
    city: string
    postcode: string
    notes: string
    time: 'asap' | 'scheduled'
    scheduledTime?: string
  }
  payment: 'cash' | 'card'
  items: Array<{
    id: string
    name: string
    price: number
    quantity: number
  }>
  subtotal: number
  deliveryFee: number
  total: number
}

function generateOrderId(): string {
  const prefix = 'PZA'
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `${prefix}-${ts}-${rand}`
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderPayload = await req.json()

    if (!body.customer?.email || !body.items?.length) {
      return NextResponse.json({ error: 'Invalid order payload' }, { status: 400 })
    }

    const orderId = generateOrderId()
    const estimatedMinutes = 35 + Math.floor(Math.random() * 10)

    // In a real app: save to DB, send email, charge card, etc.
    const order = {
      id: orderId,
      status: 'confirmed',
      estimatedMinutes,
      placedAt: new Date().toISOString(),
      ...body,
    }

    return NextResponse.json({ success: true, order }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
