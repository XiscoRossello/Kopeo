-- =============================================
-- KOPEO - Database Schema Migration
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =============================================
-- ENUM TYPES
-- =============================================
CREATE TYPE user_role AS ENUM ('client', 'commerce', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'cancelled');
CREATE TYPE wallet_drink_status AS ENUM ('available', 'redeemed');

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'client',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- COMMERCES TABLE
-- =============================================
CREATE TABLE commerces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commerce_id UUID NOT NULL REFERENCES commerces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PRODUCTS (DRINKS) TABLE
-- =============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commerce_id UUID NOT NULL REFERENCES commerces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- EVENT_PRODUCTS (which products available at each event)
-- =============================================
CREATE TABLE event_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  special_price DECIMAL(10,2),
  UNIQUE(event_id, product_id)
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- ORDER_ITEMS TABLE
-- =============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- WALLET TABLE (stores user's purchased drinks)
-- =============================================
CREATE TABLE wallet_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status wallet_drink_status NOT NULL DEFAULT 'available',
  redeemed_at TIMESTAMPTZ,
  redeemed_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_events_commerce ON events(commerce_id);
CREATE INDEX idx_events_active ON events(is_active) WHERE is_active = true;
CREATE INDEX idx_events_date ON events(start_date);
CREATE INDEX idx_events_location ON events(latitude, longitude);
CREATE INDEX idx_products_commerce ON products(commerce_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_event ON orders(event_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_wallet_user ON wallet_items(user_id);
CREATE INDEX idx_wallet_status ON wallet_items(status);
CREATE INDEX idx_wallet_user_available ON wallet_items(user_id, status) WHERE status = 'available';

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE commerces ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_items ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can do everything on profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- COMMERCES policies
CREATE POLICY "Commerces viewable by everyone" ON commerces
  FOR SELECT USING (true);
CREATE POLICY "Commerce owners can manage their commerce" ON commerces
  FOR ALL USING (owner_id = auth.uid());
CREATE POLICY "Admins can manage all commerces" ON commerces
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- EVENTS policies
CREATE POLICY "Active events viewable by everyone" ON events
  FOR SELECT USING (true);
CREATE POLICY "Commerce owners can manage their events" ON events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM commerces WHERE id = events.commerce_id AND owner_id = auth.uid())
  );
CREATE POLICY "Admins can manage all events" ON events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PRODUCTS policies
CREATE POLICY "Products viewable by everyone" ON products
  FOR SELECT USING (true);
CREATE POLICY "Commerce owners can manage their products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM commerces WHERE id = products.commerce_id AND owner_id = auth.uid())
  );
CREATE POLICY "Admins can manage all products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- EVENT_PRODUCTS policies
CREATE POLICY "Event products viewable by everyone" ON event_products
  FOR SELECT USING (true);
CREATE POLICY "Commerce owners can manage event products" ON event_products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN commerces c ON c.id = e.commerce_id
      WHERE e.id = event_products.event_id AND c.owner_id = auth.uid()
    )
  );

-- ORDERS policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Commerce owners can view orders for their events" ON orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN commerces c ON c.id = e.commerce_id
      WHERE e.id = orders.event_id AND c.owner_id = auth.uid()
    )
  );
CREATE POLICY "Admins can manage all orders" ON orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ORDER_ITEMS policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
  );
CREATE POLICY "Admins can manage all order items" ON order_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- WALLET_ITEMS policies
CREATE POLICY "Users can view own wallet" ON wallet_items
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Commerce can view wallet items for their events" ON wallet_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN commerces c ON c.id = e.commerce_id
      WHERE e.id = wallet_items.event_id AND c.owner_id = auth.uid()
    )
  );
CREATE POLICY "Commerce can update wallet items for redemption" ON wallet_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM events e
      JOIN commerces c ON c.id = e.commerce_id
      WHERE e.id = wallet_items.event_id AND c.owner_id = auth.uid()
    )
  );
CREATE POLICY "Admins can manage all wallet items" ON wallet_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commerces_updated_at BEFORE UPDATE ON commerces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get nearby events
CREATE OR REPLACE FUNCTION get_nearby_events(
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  commerce_id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  distance_km DOUBLE PRECISION,
  commerce_name TEXT,
  commerce_logo TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.commerce_id,
    e.title,
    e.description,
    e.image_url,
    e.address,
    e.latitude,
    e.longitude,
    e.start_date,
    e.end_date,
    e.is_active,
    e.created_at,
    (6371 * acos(
      cos(radians(user_lat)) * cos(radians(e.latitude)) *
      cos(radians(e.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) * sin(radians(e.latitude))
    )) AS distance_km,
    c.name AS commerce_name,
    c.logo_url AS commerce_logo
  FROM events e
  JOIN commerces c ON c.id = e.commerce_id
  WHERE e.is_active = true
    AND e.start_date >= NOW() - INTERVAL '1 day'
    AND (6371 * acos(
      cos(radians(user_lat)) * cos(radians(e.latitude)) *
      cos(radians(e.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) * sin(radians(e.latitude))
    )) <= radius_km
  ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql;
