-- Fix: Allow profile insertion on signup
CREATE POLICY "Allow profile creation on signup" ON profiles
  FOR INSERT WITH CHECK (true);
