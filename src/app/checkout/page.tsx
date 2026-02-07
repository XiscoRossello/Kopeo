'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/store/cart'
import { createClient } from '@/lib/supabase/client'
import { ShoppingCart, CreditCard, Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CheckoutPage() {
  const { items, getTotal, clearCart, eventId } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser({ id: user.id, email: user.email! })
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      router.push('/auth/login?redirect=/checkout')
      return
    }

    if (items.length === 0 || !eventId) {
      setError('Tu carrito está vacío')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.special_price ?? item.product.price,
            name: item.product.name,
          })),
          eventId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando el pago')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">🛒</div>
          <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
          <p className="text-gray-500">
            Explora los eventos disponibles y añade bebidas a tu carrito.
          </p>
          <Link
            href="/"
            className="inline-block gradient-accent px-6 py-3 rounded-xl font-semibold text-white"
          >
            Explorar eventos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="p-2 rounded-lg bg-surface hover:bg-surface-light transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Finalizar compra</h1>
            <p className="text-gray-500 text-sm">{items.length} productos en el carrito</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-surface rounded-2xl border border-border divide-y divide-border">
          {items.map((item) => (
            <div key={item.product.id} className="p-4 flex items-center gap-4">
              {item.product.image_url ? (
                <Image
                  src={item.product.image_url}
                  alt={item.product.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center text-2xl">
                  🍹
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.product.name}</p>
                <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-accent">
                  {((item.special_price ?? item.product.price) * item.quantity).toFixed(2)}€
                </p>
                <p className="text-xs text-gray-500">
                  {(item.special_price ?? item.product.price).toFixed(2)}€ c/u
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-surface rounded-2xl border border-border p-4 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>{getTotal().toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Comisión de servicio</span>
            <span className="text-green-400">Gratis</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-accent">{getTotal().toFixed(2)}€</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Auth notice */}
        {!user && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-300">
              Necesitas iniciar sesión para completar la compra
            </p>
          </div>
        )}

        {/* Checkout button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full gradient-accent py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <CreditCard size={20} />
              {user ? 'Pagar ahora' : 'Iniciar sesión y pagar'}
            </>
          )}
        </button>

        {/* Info */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>Pago seguro procesado por Stripe</p>
          <p>Puedes usar la tarjeta de prueba: 4242 4242 4242 4242</p>
        </div>
      </div>
    </div>
  )
}
