'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types'
import { Plus, Pencil, Trash2, X, Loader2, Package } from 'lucide-react'
import Image from 'next/image'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [commerceId, setCommerceId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
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
      .from('products')
      .select('*')
      .eq('commerce_id', commerce.id)
      .order('created_at', { ascending: false })

    if (data) setProducts(data)
    setLoading(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
  }

  const handleSave = async (product: Partial<Product>) => {
    if (editingProduct) {
      const { data } = await supabase
        .from('products')
        .update(product)
        .eq('id', editingProduct.id)
        .select()
        .single()

      if (data) {
        setProducts(products.map(p => p.id === editingProduct.id ? data : p))
      }
    } else {
      const { data } = await supabase
        .from('products')
        .insert({ ...product, commerce_id: commerceId })
        .select()
        .single()

      if (data) {
        setProducts([data, ...products])
      }
    }

    setShowModal(false)
    setEditingProduct(null)
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
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-gray-500">Gestiona tu catálogo de bebidas</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowModal(true) }}
          className="gradient-accent px-4 py-2 rounded-xl font-medium text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Añadir producto
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-border space-y-4">
          <Package className="mx-auto text-gray-500" size={48} />
          <h3 className="text-xl font-semibold">Sin productos</h3>
          <p className="text-gray-500">Añade tu primer producto para empezar a vender</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-surface rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors"
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={400}
                  height={200}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 gradient-primary flex items-center justify-center text-4xl">
                  🍹
                </div>
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    product.is_available
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {product.is_available ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
                {product.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                )}
                <p className="text-xl font-bold text-accent">{Number(product.price).toFixed(2)}€</p>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 py-2 rounded-lg bg-surface-light hover:bg-border transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowModal(false); setEditingProduct(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

function ProductModal({
  product,
  onClose,
  onSave,
}: {
  product: Product | null
  onClose: () => void
  onSave: (product: Partial<Product>) => void
}) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price?.toString() || '')
  const [imageUrl, setImageUrl] = useState(product?.image_url || '')
  const [category, setCategory] = useState(product?.category || '')
  const [isAvailable, setIsAvailable] = useState(product?.is_available ?? true)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await onSave({
      name,
      description: description || null,
      price: parseFloat(price),
      image_url: imageUrl || null,
      category: category || null,
      is_available: isAvailable,
    })

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-surface border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-light rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="Ej: Mojito"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Descripción del producto"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Precio *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Categoría</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                placeholder="Ej: Cócteles"
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
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-5 h-5 rounded border-border bg-background checked:bg-accent"
            />
            <span className="text-sm">Producto disponible</span>
          </label>

          <button
            type="submit"
            disabled={loading || !name || !price}
            className="w-full gradient-accent py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (product ? 'Guardar cambios' : 'Crear producto')}
          </button>
        </form>
      </div>
    </div>
  )
}
