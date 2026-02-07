'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, CalendarDays, Wallet, ScanLine, LayoutDashboard, Shield, Menu, X, LogOut, User } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(data)
      } else {
        setProfile(null)
      }
      setLoading(false)
    }
    getProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => setProfile(data))
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const clientLinks = [
    { href: '/', label: 'Inicio', icon: Home },
    { href: '/wallet', label: 'Cartera', icon: Wallet },
  ]

  const commerceLinks = [
    { href: '/scanner', label: 'Escáner', icon: ScanLine },
    { href: '/backoffice', label: 'Backoffice', icon: LayoutDashboard },
  ]

  const adminLinks = [
    { href: '/admin', label: 'Admin', icon: Shield },
  ]

  let links = [...clientLinks]
  if (profile?.role === 'commerce') links = [...links, ...commerceLinks]
  if (profile?.role === 'admin') links = [...clientLinks, ...commerceLinks, ...adminLinks]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo-sin-fondo.png" alt="Kopeo" width={40} height={40} />
              <span className="text-xl font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                Kopeo
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-primary/20 text-primary-light'
                      : 'text-gray-400 hover:text-foreground hover:bg-surface-light'
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-surface animate-pulse" />
              ) : profile ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{profile.full_name || profile.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-lg text-gray-400 hover:text-accent hover:bg-surface-light transition-all"
                    title="Cerrar sesión"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="gradient-accent px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {links.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-primary/20 text-primary-light'
                      : 'text-gray-400 hover:text-foreground hover:bg-surface-light'
                  }`}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-3 mt-3">
                {profile ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400">
                      <User size={18} />
                      {profile.full_name || profile.email}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-surface-light"
                    >
                      <LogOut size={18} />
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="block gradient-accent px-4 py-3 rounded-lg text-sm font-semibold text-white text-center"
                  >
                    Iniciar sesión
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom nav for mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass md:hidden">
        <div className={`flex items-center justify-around py-2`}>
          {links.slice(0, 5).map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg text-xs transition-all ${
                isActive(link.href)
                  ? 'text-accent'
                  : 'text-gray-500'
              }`}
            >
              <link.icon size={20} />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
