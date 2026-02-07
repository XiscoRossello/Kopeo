-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create order items" ON order_items;
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can create own wallet items" ON wallet_items;
DROP POLICY IF EXISTS "Users can view own wallet items" ON wallet_items;

-- Allow users to create their own orders
CREATE POLICY "Users can create own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to create order items for their orders
CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
  );

-- Allow users to view their order items
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND user_id = auth.uid())
  );

-- Allow users to create their own wallet items
CREATE POLICY "Users can create own wallet items" ON wallet_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own wallet items  
CREATE POLICY "Users can view own wallet items" ON wallet_items
  FOR SELECT USING (auth.uid() = user_id);
