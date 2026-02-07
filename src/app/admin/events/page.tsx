'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Event, Commerce } from '@/lib/types'
import { CalendarDays, Loader2, Trash2, Search, MapPin, ToggleLeft, ToggleRight } from 'lucide-react'
import Image from 'next/image'

export default function AdminEventsPage() {
  const [events, setEvents] = useState<(Event & { commerce?: Commerce })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    const { data } = await supabase
      .from('events')
      .select('*, commerce:commerces(*)')
      .order('start_date', { ascending: false })

    if (data) setEvents(data as (Event & { commerce?: Commerce })[])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este evento?')) return

    await supabase.from('events').delete().eq('id', id)
    setEvents(events.filter(e => e.id !== id))
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    await supabase.from('events').update({ is_active: !isActive }).eq('id', id)
    setEvents(events.map(e => e.id === id ? { ...e, is_active: !isActive } : e))
  }

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.commerce?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Eventos</h1>
        <p className="text-gray-500">{events.length} eventos en total</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Buscar eventos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-surface rounded-2xl border border-border overflow-hidden flex"
          >
            {event.image_url ? (
              <Image
                src={event.image_url}
                alt={event.title}
                width={160}
                height={120}
                className="w-40 h-full object-cover hidden sm:block"
              />
            ) : (
              <div className="w-40 h-full gradient-mixed hidden sm:flex items-center justify-center text-4xl">
                🎉
              </div>
            )}
            <div className="flex-1 p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-500">{event.commerce?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(event.id, event.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      event.is_active ? 'text-green-400' : 'text-gray-500'
                    }`}
                  >
                    {event.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <CalendarDays size={14} />
                  {new Date(event.start_date).toLocaleDateString('es-ES')}
                </span>
                {event.address && (
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {event.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
