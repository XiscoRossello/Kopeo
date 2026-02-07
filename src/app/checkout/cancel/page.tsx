'use client'

import { XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
          <XCircle className="text-red-500" size={40} />
        </div>
        <h1 className="text-3xl font-bold">Pago cancelado</h1>
        <p className="text-gray-400">
          El proceso de pago ha sido cancelado. No se ha realizado ningún cargo.
        </p>
        <div className="pt-4 space-y-3">
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 w-full gradient-accent py-3 rounded-xl font-semibold text-white"
          >
            <ArrowLeft size={20} />
            Volver al carrito
          </Link>
          <Link
            href="/"
            className="block w-full py-3 rounded-xl font-medium text-gray-400 hover:text-foreground transition-colors"
          >
            Explorar eventos
          </Link>
        </div>
      </div>
    </div>
  )
}
