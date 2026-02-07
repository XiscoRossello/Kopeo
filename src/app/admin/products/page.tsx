'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product, Commerce } from '@/lib/types'
import { Package, Loader2, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react'
import Image from 'next/image'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<(Product & { commerce?: Commerce })[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    const { data } = await supabase
      .from('products')
      .select('*, commerce:commerces(*)')
      .order('created_at', { ascending: false })

    if (data) setProducts(data as (Product & { commerce?: Commerce })[])
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return

    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
  }

  const toggleAvailable = async (id: string, isAvailable: boolean) => {
    await supabase.from('products').update({ is_available: !isAvailable }).eq('id', id)
    setProducts(products.map(p => p.id === id ? { ...p, is_available: !isAvailable } : p))
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.commerce?.name?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-2xl font-bold">Productos</h1>
        <p className="text-gray-500">{products.length} productos en total</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-surface rounded-2xl border border-border overflow-hidden"
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                width={400}
                height={150}
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="w-full h-32 gradient-primary flex items-center justify-center text-4xl">
                🍹
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.commerce?.name}</p>
                </div>
                <p className="text-accent font-bold">{Number(product.price).toFixed(2)}€</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => toggleAvailable(product.id, product.is_available)}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors ${
                    product.is_available
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {product.is_available ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  {product.is_available ? 'Disponible' : 'No disponible'}
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
