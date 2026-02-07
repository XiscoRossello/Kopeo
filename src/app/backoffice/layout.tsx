'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Commerce } from '@/lib/types'
import { LayoutDashboard, Package, CalendarDays, Store, Plus, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const [commerce, setCommerce] = useState<Commerce | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const pathname = usePathname()
  const supabase = createClient()

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

    setCommerce(data)
    setLoading(false)

    if (!data) {
      setShowCreateModal(true)
    }
  }

  const links = [
    { href: '/backoffice', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/backoffice/products', label: 'Productos', icon: Package },
    { href: '/backoffice/events', label: 'Eventos', icon: CalendarDays },
    { href: '/backoffice/commerce', label: 'Mi Comercio', icon: Store },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  if (!commerce) {
    return <CreateCommerceModal onCreated={loadCommerce} />
  }

  return (
    <div className="min-h-screen">
      {/* Sidebar for desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col pt-16">
        <div className="flex-1 flex flex-col min-h-0 bg-surface border-r border-border">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="px-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                  {commerce.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold truncate">{commerce.name}</p>
                  <p className="text-xs text-gray-500">Backoffice</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-2 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-primary/20 text-primary-light'
                      : 'text-gray-400 hover:text-foreground hover:bg-surface-light'
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-40 bg-surface border-b border-border overflow-x-auto">
        <div className="flex px-4 py-2 gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === link.href
                  ? 'bg-primary/20 text-primary-light'
                  : 'text-gray-400'
              }`}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="py-6 md:py-8 mt-12 md:mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

function CreateCommerceModal({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase.from('commerces').insert({
      owner_id: user.id,
      name,
      description,
      address,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    onCreated()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center">
            <Store size={32} className="text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">Crea tu comercio</h2>
          <p className="text-gray-500 text-sm mt-1">
            Necesitas crear un comercio para empezar a vender
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Nombre del comercio *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="Nombre de tu negocio"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Describe tu negocio"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Dirección</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
              placeholder="Dirección del local"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name}
            className="w-full gradient-accent py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Crear comercio'}
          </button>
        </form>
      </div>
    </div>
  )
}
