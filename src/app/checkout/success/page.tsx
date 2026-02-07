'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Wallet, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const [mounted, setMounted] = useState(false)
  const { clearCart } = useCartStore()

  useEffect(() => {
    setMounted(true)
    clearCart()
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="text-green-500" size={40} />
        </div>
        <h1 className="text-3xl font-bold">¡Pago completado!</h1>
        <p className="text-gray-400">
          Tu compra se ha procesado correctamente. Las bebidas ya están disponibles en tu cartera.
        </p>
        <div className="pt-4 space-y-3">
          <Link
            href="/wallet"
            className="flex items-center justify-center gap-2 w-full gradient-accent py-3 rounded-xl font-semibold text-white"
          >
            <Wallet size={20} />
            Ver mi cartera
          </Link>
          <Link
            href="/"
            className="block w-full py-3 rounded-xl font-medium text-gray-400 hover:text-foreground transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
