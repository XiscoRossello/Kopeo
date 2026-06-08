import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { items, eventId } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Carrito vacío' }, { status: 400 })
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    )

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        event_id: eventId,
        total,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json({ error: 'Error creando pedido' }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: { productId: string; quantity: number; price: number }) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.price,
    }))

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

    if (itemsError) {
      console.error('Error creating order items:', itemsError)
      return NextResponse.json({ error: 'Error creando items del pedido' }, { status: 500 })
    }

    // SIMULATED CHECKOUT (local/dev without Stripe)
    if (!stripe) {
      // Mark order as paid immediately for simulation
      await supabase
        .from('orders')
        .update({ status: 'paid', stripe_payment_intent_id: 'simulated_' + order.id })
        .eq('id', order.id)

      // Create wallet items (same logic as webhook)
      const { data: createdOrderItems } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)

      if (createdOrderItems) {
        const walletItems = createdOrderItems.flatMap((item: { quantity: number; product_id: string }) =>
          Array(item.quantity).fill(null).map(() => ({
            user_id: user.id,
            order_id: order.id,
            product_id: item.product_id,
            event_id: eventId,
            status: 'available' as const,
          }))
        )
        await supabase.from('wallet_items').insert(walletItems)
      }

      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      return NextResponse.json({
        url: `${appUrl}/checkout/success?session_id=simulated&order_id=${order.id}`,
      })
    }

    // REAL STRIPE CHECKOUT
    const lineItems = items.map((item: { name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?order_id=${order.id}`,
      metadata: {
        order_id: order.id,
        user_id: user.id,
        event_id: eventId,
      },
    })

    // Update order with stripe session id
    await supabase
      .from('orders')
      .update({ stripe_payment_intent_id: session.id })
      .eq('id', order.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
