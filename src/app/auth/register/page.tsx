'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, User, Loader2, Eye, EyeOff, Building } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'client' | 'commerce'>('client')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-sm animate-fade-in">
          <div className="text-6xl">📧</div>
          <h2 className="text-2xl font-bold">¡Revisa tu email!</h2>
          <p className="text-gray-500">
            Te hemos enviado un enlace de confirmación a <strong>{email}</strong>
          </p>
          <Link
            href="/auth/login"
            className="inline-block gradient-accent px-6 py-3 rounded-xl font-semibold text-white"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/logo-sin-fondo.png"
            alt="Kopeo"
            width={60}
            height={60}
            className="mx-auto"
          />
          <h1 className="mt-4 text-2xl font-bold">Crear cuenta</h1>
          <p className="text-gray-500 text-sm mt-1">Únete a Kopeo hoy</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`p-4 rounded-xl border transition-all ${
              role === 'client'
                ? 'border-accent bg-accent/10'
                : 'border-border hover:border-gray-500'
            }`}
          >
            <User className={`mx-auto mb-2 ${role === 'client' ? 'text-accent' : 'text-gray-500'}`} size={24} />
            <p className={`text-sm font-medium ${role === 'client' ? 'text-accent' : ''}`}>Cliente</p>
            <p className="text-xs text-gray-500">Compra bebidas</p>
          </button>
          <button
            type="button"
            onClick={() => setRole('commerce')}
            className={`p-4 rounded-xl border transition-all ${
              role === 'commerce'
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-gray-500'
            }`}
          >
            <Building className={`mx-auto mb-2 ${role === 'commerce' ? 'text-primary-light' : 'text-gray-500'}`} size={24} />
            <p className={`text-sm font-medium ${role === 'commerce' ? 'text-primary-light' : ''}`}>Comercio</p>
            <p className="text-xs text-gray-500">Vende bebidas</p>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-gray-400">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-400">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 bg-surface border border-border rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-accent py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Crear cuenta'}
          </button>
        </form>

        {/* Links */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/auth/login" className="text-accent hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
