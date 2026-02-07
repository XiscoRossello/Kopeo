'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Package, CalendarDays, ShoppingCart, Wine, TrendingUp, Loader2 } from 'lucide-react'

interface Stats {
  totalProducts: number
  totalEvents: number
  totalOrders: number
  totalDrinksSold: number
  revenue: number
}

export default function BackofficeDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: commerce } = await supabase
      .from('commerces')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!commerce) return

    // Get products count
    const { count: productsCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('commerce_id', commerce.id)

    // Get events count
    const { count: eventsCount } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('commerce_id', commerce.id)

    // Get orders through events
    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('commerce_id', commerce.id)

    const eventIds = events?.map(e => e.id) || []

    let totalOrders = 0
    let totalRevenue = 0
    let totalDrinks = 0

    if (eventIds.length > 0) {
      const { data: orders } = await supabase
        .from('orders')
        .select('id, total')
        .in('event_id', eventIds)
        .eq('status', 'paid')

      totalOrders = orders?.length || 0
      totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0

      const { count: drinksCount } = await supabase
        .from('wallet_items')
        .select('*', { count: 'exact', head: true })
        .in('event_id', eventIds)
    
      totalDrinks = drinksCount || 0
    }

    setStats({
      totalProducts: productsCount || 0,
      totalEvents: eventsCount || 0,
      totalOrders,
      totalDrinksSold: totalDrinks,
      revenue: totalRevenue,
    })
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  const statCards = [
    { label: 'Productos', value: stats?.totalProducts || 0, icon: Package, color: 'primary' },
    { label: 'Eventos', value: stats?.totalEvents || 0, icon: CalendarDays, color: 'accent' },
    { label: 'Pedidos', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'primary-light' },
    { label: 'Bebidas vendidas', value: stats?.totalDrinksSold || 0, icon: Wine, color: 'accent-light' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Resumen de tu comercio</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-2xl border border-border p-4 space-y-3"
          >
            <div className={`w-10 h-10 rounded-lg bg-${stat.color}/20 flex items-center justify-center`}>
              <stat.icon size={20} className={`text-${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue card */}
      <div className="bg-surface rounded-2xl border border-border p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center">
            <TrendingUp size={28} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ingresos totales</p>
            <p className="text-3xl font-bold text-accent">{stats?.revenue.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="/backoffice/products"
          className="bg-surface rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors group"
        >
          <Package className="text-primary-light mb-3" size={24} />
          <h3 className="font-semibold group-hover:text-primary-light transition-colors">
            Gestionar productos
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Añade, edita o elimina productos de tu catálogo
          </p>
        </a>
        <a
          href="/backoffice/events"
          className="bg-surface rounded-2xl border border-border p-6 hover:border-accent/50 transition-colors group"
        >
          <CalendarDays className="text-accent mb-3" size={24} />
          <h3 className="font-semibold group-hover:text-accent transition-colors">
            Gestionar eventos
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Crea eventos y asigna productos disponibles
          </p>
        </a>
      </div>
    </div>
  )
}
