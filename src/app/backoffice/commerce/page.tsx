'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Commerce } from '@/lib/types'
import { Store, Loader2, Save } from 'lucide-react'

export default function CommercePage() {
  const [commerce, setCommerce] = useState<Commerce | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const supabase = createClient()

  // Form fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')

  useEffect(() => {
    loadCommerce()
  }, [])

  async function loadCommerce() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('commerces')
      .select('*')
      .eq('owner_id', user.id)
      .single()

    if (data) {
      setCommerce(data)
      setName(data.name)
      setDescription(data.description || '')
      setAddress(data.address || '')
      setPhone(data.phone || '')
      setLogoUrl(data.logo_url || '')
      setLatitude(data.latitude?.toString() || '')
      setLongitude(data.longitude?.toString() || '')
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commerce) return

    setSaving(true)
    setMessage(null)

    const { error } = await supabase
      .from('commerces')
      .update({
        name,
        description: description || null,
        address: address || null,
        phone: phone || null,
        logo_url: logoUrl || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      })
      .eq('id', commerce.id)

    if (error) {
      setMessage({ type: 'error', text: 'Error al guardar los cambios' })
    } else {
      setMessage({ type: 'success', text: 'Cambios guardados correctamente' })
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Comercio</h1>
        <p className="text-gray-500">Configura la información de tu negocio</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-xl ${
          message.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-border p-6 space-y-6">
        {/* Logo preview */}
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={name}
              className="w-20 h-20 rounded-xl object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl gradient-primary flex items-center justify-center">
              <Store size={32} className="text-white" />
            </div>
          )}
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-500">Logo de tu comercio</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Nombre del comercio *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Describe tu negocio"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">URL del logo</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="Dirección del local"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Teléfono</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="+34 600 000 000"
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
        </div>

        <button
          type="submit"
          disabled={saving || !name}
          className="w-full gradient-accent py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Guardar cambios
        </button>
      </form>
    </div>
  )
}
