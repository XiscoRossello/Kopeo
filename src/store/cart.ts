import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  eventId: string | null
  addItem: (product: Product, eventId: string, specialPrice?: number | null) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      eventId: null,

      addItem: (product, eventId, specialPrice) => {
        const { items, eventId: currentEventId } = get()

        // If cart has items from a different event, clear it
        if (currentEventId && currentEventId !== eventId) {
          set({ items: [{ product, quantity: 1, event_id: eventId, special_price: specialPrice }], eventId })
          return
        }

        const existingItem = items.find(item => item.product.id === product.id)
        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            eventId,
          })
        } else {
          set({
            items: [...items, { product, quantity: 1, event_id: eventId, special_price: specialPrice }],
            eventId,
          })
        }
      },

      removeItem: (productId) => {
        const { items } = get()
        const newItems = items.filter(item => item.product.id !== productId)
        set({ items: newItems, eventId: newItems.length > 0 ? get().eventId : null })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [], eventId: null }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.special_price ?? item.product.price
          return total + price * item.quantity
        }, 0)
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'kopeo-cart',
    }
  )
)
