'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { WalletItem } from '@/lib/types'
import { QrCode, Loader2, Wine, Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'
import QRCode from 'qrcode'

export default function WalletPage() {
  const [walletItems, setWalletItems] = useState<WalletItem[]>([])
  const [loading, setLoading] = useState(true)
  const [qrCode, setQrCode] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadWallet()
  }, [])

  async function loadWallet() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    setUserId(user.id)

    // Generate QR code with user ID
    const qr = await QRCode.toDataURL(user.id, {
      width: 300,
      margin: 2,
      color: {
        dark: '#FFFFFF',
        light: '#0A0A0A',
      },
    })
    setQrCode(qr)

    // Load wallet items
    const { data } = await supabase
      .from('wallet_items')
      .select('*, product:products(*), event:events(*)')
      .eq('user_id', user.id)
      .eq('status', 'available')
      .order('created_at', { ascending: false })

    if (data) setWalletItems(data as WalletItem[])
    setLoading(false)
  }

  // Group items by event
  const groupedItems = walletItems.reduce((groups, item) => {
    const eventId = item.event_id
    if (!groups[eventId]) {
      groups[eventId] = {
        event: item.event,
        items: [],
      }
    }
    groups[eventId].items.push(item)
    return groups
  }, {} as Record<string, { event: typeof walletItems[0]['event']; items: WalletItem[] }>)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl">🔐</div>
          <h2 className="text-2xl font-bold">Inicia sesión para ver tu cartera</h2>
          <p className="text-gray-500">
            Necesitas una cuenta para comprar bebidas y acceder a tu cartera digital.
          </p>
          <a
            href="/auth/login"
            className="inline-block gradient-accent px-6 py-3 rounded-xl font-semibold text-white"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Tu Cartera</h1>
          <p className="text-gray-500">Muestra tu QR en el local para canjear tus bebidas</p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-surface rounded-3xl border border-border p-6 space-y-4 animate-pulse-glow">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <QrCode size={16} />
              <span>Tu código QR personal</span>
            </div>
            {qrCode && (
              <Image
                src={qrCode}
                alt="Tu QR"
                width={250}
                height={250}
                className="rounded-xl mx-auto"
              />
            )}
            <p className="text-xs text-center text-gray-500 max-w-[250px]">
              Este código es único y está vinculado a tu cuenta. No lo compartas.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <div className="text-3xl font-bold text-accent">{walletItems.length}</div>
            <div className="text-sm text-gray-500">Bebidas disponibles</div>
          </div>
          <div className="bg-surface rounded-xl border border-border p-4 text-center">
            <div className="text-3xl font-bold text-primary-light">
              {Object.keys(groupedItems).length}
            </div>
            <div className="text-sm text-gray-500">Eventos</div>
          </div>
        </div>

        {/* Drinks by event */}
        {walletItems.length === 0 ? (
          <div className="text-center py-12 bg-surface rounded-2xl border border-border space-y-4">
            <div className="text-6xl">🍹</div>
            <h3 className="text-xl font-semibold">Tu cartera está vacía</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Aún no has comprado bebidas. Explora los eventos disponibles y
              compra tus bebidas por adelantado.
            </p>
            <a
              href="/"
              className="inline-block gradient-accent px-6 py-3 rounded-xl font-semibold text-white"
            >
              Explorar eventos
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Wine className="text-accent" size={20} />
              Tus bebidas
            </h2>

            {Object.entries(groupedItems).map(([eventId, { event, items }]) => (
              <div
                key={eventId}
                className="bg-surface rounded-2xl border border-border overflow-hidden"
              >
                {/* Event header */}
                <div className="p-4 border-b border-border bg-background/50">
                  <h3 className="font-semibold">{event?.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    {event?.start_date && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(event.start_date).toLocaleDateString('es-ES')}
                      </span>
                    )}
                    {event?.address && (
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {event.address}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-background rounded-xl p-3"
                    >
                      {item.product?.image_url ? (
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center text-xl">
                          🍹
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-xs text-green-400">Disponible para canjear</p>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
