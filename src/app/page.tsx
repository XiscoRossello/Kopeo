'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/lib/types'
import { MapPin, Calendar, Navigation, Loader2, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          setLocationError('No pudimos obtener tu ubicación. Mostrando todos los eventos.')
          loadAllEvents()
        }
      )
    } else {
      setLocationError('Geolocalización no soportada. Mostrando todos los eventos.')
      loadAllEvents()
    }
  }, [])

  useEffect(() => {
    if (userLocation) {
      loadNearbyEvents(userLocation.lat, userLocation.lng)
    }
  }, [userLocation])

  async function loadNearbyEvents(lat: number, lng: number) {
    setLoading(true)
    const { data, error } = await supabase.rpc('get_nearby_events', {
      user_lat: lat,
      user_lng: lng,
      radius_km: 100,
    })

    if (error) {
      console.error('Error loading nearby events:', error)
      loadAllEvents()
      return
    }

    setEvents(data || [])
    setLoading(false)
  }

  async function loadAllEvents() {
    setLoading(true)
    const { data, error } = await supabase
      .from('events')
      .select('*, commerce:commerces(name, logo_url)')
      .eq('is_active', true)
      .gte('start_date', new Date(Date.now() - 86400000).toISOString())
      .order('start_date', { ascending: true })

    if (!error && data) {
      setEvents(data.map((e: Record<string, unknown>) => ({
        ...e,
        commerce_name: (e.commerce as Record<string, unknown>)?.name as string,
        commerce_logo: (e.commerce as Record<string, unknown>)?.logo_url as string,
      })) as Event[])
    }
    setLoading(false)
  }

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.commerce_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center space-y-6 animate-fade-in">
            <Image
              src="/logo-sin-fondo.png"
              alt="Kopeo"
              width={80}
              height={80}
              className="mx-auto"
            />
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Tus bebidas
              </span>
              <br />
              <span className="text-foreground">antes de llegar</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Descubre eventos cerca de ti, compra tus bebidas por adelantado y
              canjéalas con tu código QR. Sin colas, sin esperas.
            </p>

            {/* Search bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Buscar eventos, locales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {userLocation && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Navigation size={14} className="text-accent" />
                <span>Mostrando eventos cercanos a tu ubicación</span>
              </div>
            )}
            {locationError && (
              <p className="text-sm text-accent-light">{locationError}</p>
            )}
          </div>
        </div>
      </section>

      {/* Events grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {userLocation ? 'Eventos cerca de ti' : 'Todos los eventos'}
          </h2>
          <span className="text-sm text-gray-500">{filteredEvents.length} eventos</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="text-6xl">🎵</div>
            <h3 className="text-xl font-semibold">No hay eventos disponibles</h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'No encontramos eventos con esa búsqueda'
                : 'Vuelve a intentarlo más tarde o amplía tu radio de búsqueda'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <Link
                key={event.id}
                href={`/event/${event.id}`}
                className="group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full gradient-mixed flex items-center justify-center">
                        <span className="text-6xl">🎉</span>
                      </div>
                    )}
                    {event.distance_km !== undefined && (
                      <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full text-xs font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-accent" />
                          {event.distance_km.toFixed(1)} km
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg group-hover:text-accent transition-colors line-clamp-1">
                        {event.title}
                      </h3>
                    </div>

                    {event.description && (
                      <p className="text-gray-500 text-sm line-clamp-2">{event.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-primary-light" />
                        {formatDate(event.start_date)}
                      </span>
                    </div>

                    {event.address && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={14} className="text-accent shrink-0" />
                        <span className="truncate">{event.address}</span>
                      </div>
                    )}

                    {event.commerce_name && (
                      <div className="flex items-center gap-2 pt-2 border-t border-border">
                        {event.commerce_logo ? (
                          <Image
                            src={event.commerce_logo}
                            alt={event.commerce_name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full gradient-primary" />
                        )}
                        <span className="text-xs text-gray-500">{event.commerce_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
