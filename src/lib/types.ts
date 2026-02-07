export type UserRole = 'client' | 'commerce' | 'admin'
export type OrderStatus = 'pending' | 'paid' | 'cancelled'
export type WalletDrinkStatus = 'available' | 'redeemed'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Commerce {
  id: string
  owner_id: string
  name: string
  description: string | null
  logo_url: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  phone: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  commerce_id: string
  title: string
  description: string | null
  image_url: string | null
  address: string | null
  latitude: number | null
  longitude: number | null
  start_date: string
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  // Joined fields
  distance_km?: number
  commerce_name?: string
  commerce_logo?: string
  commerce?: Commerce
}

export interface Product {
  id: string
  commerce_id: string
  name: string
  description: string | null
  image_url: string | null
  price: number
  category: string | null
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface EventProduct {
  id: string
  event_id: string
  product_id: string
  special_price: number | null
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  event_id: string
  total: number
  status: OrderStatus
  stripe_payment_intent_id: string | null
  created_at: string
  updated_at: string
  items?: OrderItem[]
  event?: Event
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  created_at: string
  product?: Product
}

export interface WalletItem {
  id: string
  user_id: string
  order_id: string
  product_id: string
  event_id: string
  status: WalletDrinkStatus
  redeemed_at: string | null
  redeemed_by: string | null
  created_at: string
  product?: Product
  event?: Event
}

export interface CartItem {
  product: Product
  quantity: number
  event_id: string
  special_price?: number | null
}
