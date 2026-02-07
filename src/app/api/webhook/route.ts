import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const orderId = session.metadata?.order_id
    const userId = session.metadata?.user_id
    const eventId = session.metadata?.event_id

    if (!orderId || !userId || !eventId) {
      console.error('Missing metadata in session')
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    // Update order status
    await supabaseAdmin
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId)

    // Get order items
    const { data: orderItems } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (orderItems) {
      // Create wallet items for each purchased item
      const walletItems = orderItems.flatMap((item) =>
        Array(item.quantity).fill(null).map(() => ({
          user_id: userId,
          order_id: orderId,
          product_id: item.product_id,
          event_id: eventId,
          status: 'available',
        }))
      )

      await supabaseAdmin.from('wallet_items').insert(walletItems)
    }

    console.log(`Order ${orderId} completed, wallet items created`)
  }

  return NextResponse.json({ received: true })
}
