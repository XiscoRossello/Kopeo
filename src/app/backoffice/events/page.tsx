'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Event, Product, EventProduct } from '@/lib/types'
import { Plus, Pencil, Trash2, X, Loader2, CalendarDays, MapPin, Package } from 'lucide-react'
import Image from 'next/image'
import AddressAutocomplete from '@/components/AddressAutocomplete'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [commerceId, setCommerceId] = useState<string | null>(null)
  const [showProductsModal, setShowProductsModal] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: commerce } = await supabase
      .from('commerces')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!commerce) return
    setCommerceId(commerce.id)

    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('commerce_id', commerce.id)
      .order('start_date', { ascending: false })

    if (data) setEvents(data)
    setLoading(false)
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return

    await supabase.from('events').delete().eq('id', id)
    setEvents(events.filter(e => e.id !== id))
  }

  const handleSave = async (event: Partial<Event>) => {
    if (editingEvent) {
      const { data } = await supabase
        .from('events')
        .update(event)
        .eq('id', editingEvent.id)
        .select()
        .single()

      if (data) {
        setEvents(events.map(e => e.id === editingEvent.id ? data : e))
      }
    } else {
      const { data } = await supabase
        .from('events')
        .insert({ ...event, commerce_id: commerceId })
        .select()
        .single()

      if (data) {
        setEvents([data, ...events])
      }
    }

    setShowModal(false)
    setEditingEvent(null)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Eventos</h1>
          <p className="text-gray-500">Gestiona tus eventos y fiestas</p>
        </div>
        <button
          onClick={() => { setEditingEvent(null); setShowModal(true) }}
          className="gradient-accent px-4 py-2 rounded-xl font-medium text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Crear evento
        </button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-border space-y-4">
          <CalendarDays className="mx-auto text-gray-500" size={48} />
          <h3 className="text-xl font-semibold">Sin eventos</h3>
          <p className="text-gray-500">Crea tu primer evento para empezar a vender</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-surface rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row">
                {event.image_url ? (
                  <Image
                    src={event.image_url}
                    alt={event.title}
                    width={200}
                    height={150}
                    className="w-full md:w-48 h-32 md:h-auto object-cover"
                  />
                ) : (
                  <div className="w-full md:w-48 h-32 md:h-auto gradient-mixed flex items-center justify-center text-4xl">
                    🎉
                  </div>
                )}
                <div className="flex-1 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={14} />
                          {formatDate(event.start_date)}
                        </span>
                        {event.address && (
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {event.address}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      event.is_active
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {event.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{event.description}</p>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setShowProductsModal(event.id)}
                      className="flex-1 py-2 rounded-lg bg-primary/20 text-primary-light hover:bg-primary/30 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Package size={14} />
                      Productos
                    </button>
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex-1 py-2 rounded-lg bg-surface-light hover:bg-border transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                      <Pencil size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Event Modal */}
      {showModal && (
        <EventModal
          event={editingEvent}
          onClose={() => { setShowModal(false); setEditingEvent(null) }}
          onSave={handleSave}
        />
      )}

      {/* Products Modal */}
      {showProductsModal && commerceId && (
        <EventProductsModal
          eventId={showProductsModal}
          commerceId={commerceId}
          onClose={() => setShowProductsModal(null)}
        />
      )}
    </div>
  )
}

function EventModal({
  event,
  onClose,
  onSave,
}: {
  event: Event | null
  onClose: () => void
  onSave: (event: Partial<Event>) => void
}) {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [address, setAddress] = useState(event?.address || '')
  const [imageUrl, setImageUrl] = useState(event?.image_url || '')
  const [startDate, setStartDate] = useState(
    event?.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : ''
  )
  const [endDate, setEndDate] = useState(
    event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : ''
  )
  const [latitude, setLatitude] = useState(event?.latitude?.toString() || '')
  const [longitude, setLongitude] = useState(event?.longitude?.toString() || '')
  const [isActive, setIsActive] = useState(event?.is_active ?? true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await onSave({
      title,
      description: description || null,
      address: address || null,
      image_url: imageUrl || null,
      start_date: new Date(startDate).toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      is_active: isActive,
    })

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {event ? 'Editar evento' : 'Nuevo evento'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-light rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="Nombre del evento"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Descripción del evento"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Fecha inicio *</label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Fecha fin</label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Dirección</label>
            <AddressAutocomplete
              value={address}
              onChange={(addr, lat, lon) => {
                setAddress(addr)
                if (lat) setLatitude(lat)
                if (lon) setLongitude(lon)
              }}
              placeholder="Buscar dirección del evento"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Latitud</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                placeholder="39.4699"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Longitud</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                placeholder="-0.3763"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">URL de imagen</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="https://..."
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 rounded border-border bg-background checked:bg-accent"
            />
            <span className="text-sm">Evento activo</span>
          </label>

          <button
            type="submit"
            disabled={loading || !title || !startDate}
            className="w-full gradient-accent py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (event ? 'Guardar cambios' : 'Crear evento')}
          </button>
        </form>
      </div>
    </div>
  )
}

function EventProductsModal({
  eventId,
  commerceId,
  onClose,
}: {
  eventId: string
  commerceId: string
  onClose: () => void
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [eventProducts, setEventProducts] = useState<EventProduct[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const [productsRes, eventProductsRes] = await Promise.all([
      supabase.from('products').select('*').eq('commerce_id', commerceId),
      supabase.from('event_products').select('*').eq('event_id', eventId),
    ])

    if (productsRes.data) setProducts(productsRes.data)
    if (eventProductsRes.data) setEventProducts(eventProductsRes.data)
    setLoading(false)
  }

  const isProductAdded = (productId: string) => {
    return eventProducts.some(ep => ep.product_id === productId)
  }

  const toggleProduct = async (productId: string) => {
    if (isProductAdded(productId)) {
      await supabase
        .from('event_products')
        .delete()
        .eq('event_id', eventId)
        .eq('product_id', productId)
      setEventProducts(eventProducts.filter(ep => ep.product_id !== productId))
    } else {
      const { data } = await supabase
        .from('event_products')
        .insert({ event_id: eventId, product_id: productId })
        .select()
        .single()
      if (data) setEventProducts([...eventProducts, data])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl border border-border w-full max-w-md max-h-[80vh] overflow-hidden animate-fade-in">
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Productos del evento</h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-light rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-72px)]">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No tienes productos. Crea productos primero.
            </p>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    isProductAdded(product.id)
                      ? 'border-accent bg-accent/10'
                      : 'border-border hover:border-gray-500'
                  }`}
                >
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                      🍹
                    </div>
                  )}
                  <div className="flex-1 text-left">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-accent">{Number(product.price).toFixed(2)}€</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isProductAdded(product.id)
                      ? 'border-accent bg-accent text-white'
                      : 'border-gray-500'
                  }`}>
                    {isProductAdded(product.id) && <span className="text-sm">✓</span>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
