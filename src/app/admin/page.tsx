'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Store, CalendarDays, Package, ShoppingCart, Wine, TrendingUp, Loader2 } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalCommerces: number
  totalEvents: number
  totalProducts: number
  totalOrders: number
  totalWalletItems: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    const [
      usersRes,
      commercesRes,
      eventsRes,
      productsRes,
      ordersRes,
      walletRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('commerces').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('id, total, status'),
      supabase.from('wallet_items').select('*', { count: 'exact', head: true }),
    ])

    const paidOrders = (ordersRes.data || []).filter(o => o.status === 'paid')
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0)

    setStats({
      totalUsers: usersRes.count || 0,
      totalCommerces: commercesRes.count || 0,
      totalEvents: eventsRes.count || 0,
      totalProducts: productsRes.count || 0,
      totalOrders: paidOrders.length,
      totalWalletItems: walletRes.count || 0,
      totalRevenue,
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
    { label: 'Usuarios', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500/20', iconColor: 'text-blue-500' },
    { label: 'Comercios', value: stats?.totalCommerces || 0, icon: Store, color: 'bg-purple-500/20', iconColor: 'text-purple-500' },
    { label: 'Eventos', value: stats?.totalEvents || 0, icon: CalendarDays, color: 'bg-accent/20', iconColor: 'text-accent' },
    { label: 'Productos', value: stats?.totalProducts || 0, icon: Package, color: 'bg-primary/20', iconColor: 'text-primary-light' },
    { label: 'Pedidos', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'bg-green-500/20', iconColor: 'text-green-500' },
    { label: 'Bebidas vendidas', value: stats?.totalWalletItems || 0, icon: Wine, color: 'bg-pink-500/20', iconColor: 'text-pink-500' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500">Vista general de la plataforma</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-2xl border border-border p-4 space-y-3"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
              <stat.icon size={20} className={stat.iconColor} />
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
            <p className="text-sm text-gray-500">Ingresos totales (plataforma)</p>
            <p className="text-3xl font-bold text-accent">{stats?.totalRevenue.toFixed(2)}€</p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a
          href="/admin/users"
          className="bg-surface rounded-2xl border border-border p-6 hover:border-blue-500/50 transition-colors group"
        >
          <Users className="text-blue-500 mb-3" size={24} />
          <h3 className="font-semibold group-hover:text-blue-500 transition-colors">
            Gestionar usuarios
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Ver, editar y eliminar usuarios
          </p>
        </a>
        <a
          href="/admin/commerces"
          className="bg-surface rounded-2xl border border-border p-6 hover:border-purple-500/50 transition-colors group"
        >
          <Store className="text-purple-500 mb-3" size={24} />
          <h3 className="font-semibold group-hover:text-purple-500 transition-colors">
            Gestionar comercios
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Administrar todos los comercios
          </p>
        </a>
        <a
          href="/admin/orders"
          className="bg-surface rounded-2xl border border-border p-6 hover:border-green-500/50 transition-colors group"
        >
          <ShoppingCart className="text-green-500 mb-3" size={24} />
          <h3 className="font-semibold group-hover:text-green-500 transition-colors">
            Ver pedidos
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Historial de todos los pedidos
          </p>
        </a>
      </div>
    </div>
  )
}
