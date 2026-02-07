'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Event, Product, EventProduct } from '@/lib/types'
import { MapPin, Calendar, Clock, ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cart'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function EventPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [products, setProducts] = useState<(EventProduct & { product: Product })[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem, items } = useCartStore()
  const supabase = createClient()

  useEffect(() => {
    loadEvent()
    loadProducts()
  }, [id])

  async function loadEvent() {
    const { data } = await supabase
      .from('events')
      .select('*, commerce:commerces(*)')
      .eq('id', id)
      .single()

    if (data) setEvent(data as Event)
    setLoading(false)
  }

  async function loadProducts() {
    const { data } = await supabase
      .from('event_products')
      .select('*, product:products(*)')
      .eq('event_id', id)

    if (data) setProducts(data as (EventProduct & { product: Product })[])
  }

  const getQuantityInCart = (productId: string) => {
    const item = items.find(i => i.product.id === productId)
    return item?.quantity || 0
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) return <LoadingSpinner size="lg" />

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😕</div>
          <h2 className="text-2xl font-bold">Evento no encontrado</h2>
          <Link href="/" className="text-accent hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-96">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full gradient-mixed" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-4 left-4 glass p-2 rounded-full hover:bg-surface-light transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="bg-surface rounded-2xl border border-border p-6 md:p-8 space-y-6 animate-fade-in">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>

            {event.commerce && (
              <div className="flex items-center gap-3">
                {event.commerce.logo_url ? (
                  <Image
                    src={event.commerce.logo_url}
                    alt={event.commerce.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full gradient-primary" />
                )}
                <div>
                  <p className="font-medium">{event.commerce.name}</p>
                  <p className="text-sm text-gray-500">Organizador</p>
                </div>
              </div>
            )}
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-xl p-4 flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Calendar className="text-primary-light" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="font-medium">{formatDate(event.start_date)}</p>
              </div>
            </div>

            <div className="bg-background rounded-xl p-4 flex items-center gap-3">
              <div className="p-3 rounded-full bg-accent/20">
                <Clock className="text-accent" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hora</p>
                <p className="font-medium">{formatTime(event.start_date)}</p>
              </div>
            </div>

            {event.address && (
              <div className="bg-background rounded-xl p-4 flex items-center gap-3">
                <div className="p-3 rounded-full bg-accent-light/20">
                  <MapPin className="text-accent-light" size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium truncate">{event.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Descripción</h2>
              <p className="text-gray-400 leading-relaxed">{event.description}</p>
            </div>
          )}

          {/* Map placeholder */}
          {event.latitude && event.longitude && (
            <div className="rounded-xl overflow-hidden border border-border">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.longitude - 0.01}%2C${event.latitude - 0.01}%2C${event.longitude + 0.01}%2C${event.latitude + 0.01}&layer=mapnik&marker=${event.latitude}%2C${event.longitude}`}
                className="w-full h-48 md:h-64"
                style={{ border: 0 }}
              />
            </div>
          )}
        </div>

        {/* Products */}
        <div className="py-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              <span className="text-accent">Bebidas</span> disponibles
            </h2>
            <span className="text-sm text-gray-500">{products.length} productos</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 bg-surface rounded-2xl border border-border">
              <div className="text-4xl mb-4">🍹</div>
              <p className="text-gray-500">No hay bebidas disponibles para este evento</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((ep) => {
                const price = ep.special_price ?? ep.product.price
                const quantityInCart = getQuantityInCart(ep.product.id)

                return (
                  <div
                    key={ep.id}
                    className="bg-surface rounded-2xl border border-border p-4 flex gap-4 animate-fade-in hover:border-primary/30 transition-colors"
                  >
                    {/* Image */}
                    {ep.product.image_url ? (
                      <Image
                        src={ep.product.image_url}
                        alt={ep.product.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl gradient-primary flex items-center justify-center text-3xl shrink-0">
                        🍹
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-semibold truncate">{ep.product.name}</h3>
                      {ep.product.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {ep.product.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-accent">{price.toFixed(2)}€</span>
                        {ep.special_price && ep.special_price < ep.product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {ep.product.price.toFixed(2)}€
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Add to cart */}
                    <div className="flex items-center">
                      {quantityInCart > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => useCartStore.getState().updateQuantity(ep.product.id, quantityInCart - 1)}
                            className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center hover:bg-border transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-6 text-center font-medium">{quantityInCart}</span>
                          <button
                            onClick={() => addItem(ep.product, event.id, ep.special_price)}
                            className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addItem(ep.product, event.id, ep.special_price)}
                          className="gradient-accent px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                          <ShoppingCart size={16} />
                          Añadir
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
