'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Shield, Users, Store, CalendarDays, Package, ShoppingCart, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    checkAdmin()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setIsAdmin(data?.role === 'admin')
            setLoading(false)
          })
      } else {
        setIsAdmin(false)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      router.push('/auth/login?redirect=/admin')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    setIsAdmin(profile?.role === 'admin')
    setLoading(false)
  }

  const links = [
    { href: '/admin', label: 'Dashboard', icon: Shield },
    { href: '/admin/users', label: 'Usuarios', icon: Users },
    { href: '/admin/commerces', label: 'Comercios', icon: Store },
    { href: '/admin/events', label: 'Eventos', icon: CalendarDays },
    { href: '/admin/products', label: 'Productos', icon: Package },
    { href: '/admin/orders', label: 'Pedidos', icon: ShoppingCart },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Shield className="mx-auto text-red-500" size={48} />
          <h2 className="text-2xl font-bold">Acceso denegado</h2>
          <p className="text-gray-500">No tienes permisos de administrador</p>
          <Link href="/" className="inline-block gradient-accent px-6 py-3 rounded-xl font-semibold text-white">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Sidebar for desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col pt-16">
        <div className="flex-1 flex flex-col min-h-0 bg-surface border-r border-border">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="px-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Shield className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="font-semibold">Admin Panel</p>
                  <p className="text-xs text-gray-500">Control total</p>
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
