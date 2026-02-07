'use client'

import { ShoppingCart, Minus, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, updateQuantity, removeItem, clearCart, getTotal, getItemCount } = useCartStore()
  const router = useRouter()
  const itemCount = getItemCount()

  const handleCheckout = () => {
    setIsOpen(false)
    router.push('/checkout')
  }

  if (itemCount === 0) return null

  return (
    <>
      {/* Floating cart button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 gradient-accent p-4 rounded-full shadow-lg shadow-accent/30 hover:scale-105 transition-transform"
      >
        <ShoppingCart size={24} className="text-white" />
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
          {itemCount}
        </span>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-surface border-l border-border transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-bold">Tu Carrito</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg hover:bg-surface-light transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map(item => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 bg-background rounded-xl p-3"
              >
                {item.product.image_url ? (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg gradient-primary flex items-center justify-center text-2xl">
                    🍹
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.product.name}</p>
                  <p className="text-accent font-bold text-sm">
                    {(item.special_price ?? item.product.price).toFixed(2)}€
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-surface-light flex items-center justify-center hover:bg-border transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-surface-light flex items-center justify-center hover:bg-border transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total</span>
              <span className="text-2xl font-bold text-accent">{getTotal().toFixed(2)}€</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full gradient-accent py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Pagar ahora
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 rounded-xl text-sm text-gray-500 hover:text-red-400 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
