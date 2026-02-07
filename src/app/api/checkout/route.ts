import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Modo simulación - sin Stripe real
const SIMULATE_STRIPE = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_your_stripe_secret_key'

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
        status: SIMULATE_STRIPE ? 'paid' : 'pending',
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

    // MODO SIMULACIÓN: Crear wallet items directamente sin Stripe
    if (SIMULATE_STRIPE) {
      // Create wallet items for each purchased item
      const walletItems = items.flatMap((item: { productId: string; quantity: number }) =>
        Array(item.quantity).fill(null).map(() => ({
          user_id: user.id,
          order_id: order.id,
          product_id: item.productId,
          event_id: eventId,
          status: 'available',
        }))
      )

      await supabase.from('wallet_items').insert(walletItems)

      return NextResponse.json({ 
        url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${order.id}&simulated=true` 
      })
    }

    // MODO REAL: Usar Stripe
    const { stripe } = await import('@/lib/stripe')
    
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
