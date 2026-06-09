'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Order } from '@/lib/types'
import { ShoppingCart, Loader2, Search, Eye, X, CheckCircle, Clock, XCircle } from 'lucide-react'

type OrderWithDetails = Order & {
  profile?: { full_name: string; email: string }
  event?: { title: string }
  order_items?: { quantity: number; unit_price: number; product: { name: string } }[]
}

export default function BackofficeOrdersPage() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: commerce } = await supabase
      .from('commerces')
      .select('id')
      .eq('owner_id', user.id)
      .single()

    if (!commerce) {
      setLoading(false)
      return
    }

    // Get events for this commerce
    const { data: events } = await supabase
      .from('events')
      .select('id')
      .eq('commerce_id', commerce.id)

    const eventIds = events?.map((e) => e.id) || []
    if (eventIds.length === 0) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        profile:profiles(full_name, email),
        event:events(title),
        order_items(quantity, unit_price, product:products(name))
      `)
      .in('event_id', eventIds)
      .order('created_at', { ascending: false })

    if (data) setOrders(data as OrderWithDetails[])
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
            <CheckCircle size={12} /> Pagado
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-400">
            <Clock size={12} /> Pendiente
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
            <XCircle size={12} /> Cancelado
          </span>
        )
      default:
        return status
    }
  }

  const filteredOrders = orders.filter((o) =>
    o.profile?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.profile?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.event?.title?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <p className="text-gray-500">{orders.length} pedidos en tus eventos</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Buscar pedidos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-border space-y-4">
          <ShoppingCart className="mx-auto text-gray-500" size={48} />
          <h3 className="text-xl font-semibold">Sin pedidos</h3>
          <p className="text-gray-500">Aún no hay pedidos en tus eventos</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm border-b border-border">
                <th className="py-3 px-4">Usuario</th>
                <th className="py-3 px-4">Evento</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border hover:bg-surface/50">
                  <td className="py-3 px-4">
                    <p className="font-medium">{order.profile?.full_name}</p>
                    <p className="text-xs text-gray-500">{order.profile?.email}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{order.event?.title}</td>
                  <td className="py-3 px-4 text-accent font-bold">{Number(order.total).toFixed(2)}€</td>
                  <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {new Date(order.created_at).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-2xl border border-border max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 gradient-primary rounded-lg">
                  <ShoppingCart size={20} />
                </div>
                <h2 className="text-lg font-bold">Detalles del Pedido</h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-lg text-gray-400 hover:text-foreground hover:bg-surface transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Usuario</p>
                  <p className="font-medium">{selectedOrder.profile?.full_name}</p>
                  <p className="text-xs text-gray-500">{selectedOrder.profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Evento</p>
                  <p className="font-medium">{selectedOrder.event?.title}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="text-sm text-gray-500 mb-2">Productos</p>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="text-accent font-medium">{(Number(item.unit_price) * item.quantity).toFixed(2)}€</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <p className="font-semibold">Total</p>
                <p className="text-xl text-accent font-bold">{Number(selectedOrder.total).toFixed(2)}€</p>
              </div>

              <p className="text-xs text-gray-500">
                Fecha: {new Date(selectedOrder.created_at).toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
