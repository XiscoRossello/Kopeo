'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Commerce, Profile } from '@/lib/types'
import { Store, Loader2, Trash2, Search, MapPin } from 'lucide-react'

export default function AdminCommercesPage() {
  const [commerces, setCommerces] = useState<(Commerce & { owner?: Profile })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadCommerces()
  }, [])

  async function loadCommerces() {
    const { data } = await supabase
      .from('commerces')
      .select('*, owner:profiles!owner_id(*)')
      .order('created_at', { ascending: false })

    if (data) setCommerces(data as (Commerce & { owner?: Profile })[])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este comercio? Esta acción eliminará también todos sus productos y eventos.')) return

    await supabase.from('commerces').delete().eq('id', id)
    setCommerces(commerces.filter(c => c.id !== id))
  }

  const filteredCommerces = commerces.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.owner?.email?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-2xl font-bold">Comercios</h1>
        <p className="text-gray-500">{commerces.length} comercios registrados</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Buscar comercios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCommerces.map((commerce) => (
          <div
            key={commerce.id}
            className="bg-surface rounded-2xl border border-border p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {commerce.logo_url ? (
                  <img
                    src={commerce.logo_url}
                    alt={commerce.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Store className="text-white" size={20} />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{commerce.name}</p>
                  <p className="text-xs text-gray-500">{commerce.owner?.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(commerce.id)}
                className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            {commerce.address && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin size={14} />
                {commerce.address}
              </div>
            )}
            <p className="text-xs text-gray-500">
              Creado: {new Date(commerce.created_at).toLocaleDateString('es-ES')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
