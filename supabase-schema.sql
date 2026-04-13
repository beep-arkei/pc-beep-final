-- PC Beep Database Schema for Supabase

-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('buyer', 'admin', 'owner')) DEFAULT 'buyer',
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  parent_category TEXT NOT NULL DEFAULT 'Core Components',
  specs JSONB DEFAULT '{}'::jsonb,
  image_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT false,
  is_deal BOOLEAN DEFAULT false,
  is_unlisted BOOLEAN DEFAULT false,
  discount_price NUMERIC,
  promotion_label TEXT, -- e.g., "Hot Deal", "Limited Edition"
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT CHECK (status IN ('pending', 'processing', 'packing', 'courier_pickup', 'in_transit', 'out_for_delivery', 'delivered', 'completed', 'cancelled', 'refund_requested', 'refunded')) DEFAULT 'pending',
  total_amount NUMERIC NOT NULL,
  order_type TEXT CHECK (order_type IN ('buy', 'build')) NOT NULL,
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT DEFAULT 'unpaid',
  tracking_number TEXT,
  cancellation_reason TEXT,
  fulfilled_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  payment_proof_url TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders ON DELETE CASCADE,
  product_id UUID REFERENCES products ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price_at_purchase NUMERIC NOT NULL
);

-- RLS Policies (Basic)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);

-- Function to check if user is admin or owner
-- We use SECURITY DEFINER to bypass RLS checks on the profiles table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'owner')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to check if user is owner
CREATE OR REPLACE FUNCTION is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE POLICY "Admins can insert products" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update products" ON products FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete products" ON products FOR DELETE USING (is_admin());

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles SELECT" ON profiles FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Profiles INSERT" ON profiles FOR INSERT WITH CHECK (auth.uid() = id OR is_owner());
CREATE POLICY "Profiles UPDATE" ON profiles FOR UPDATE USING (is_owner() OR (auth.uid() = id AND (SELECT role FROM profiles WHERE id = auth.uid()) = role));
CREATE POLICY "Profiles DELETE" ON profiles FOR DELETE USING (is_owner());

-- RLS Policies for Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own orders for refunds" ON orders FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (status = 'refund_requested');
CREATE POLICY "Admins can view all orders" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all orders" ON orders FOR UPDATE USING (is_admin());

-- RLS Policies for Order Items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);
CREATE POLICY "Users can create their own order items" ON order_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);
CREATE POLICY "Admins can view all order items" ON order_items FOR SELECT USING (is_admin());

-- 5. OTPs Table (For email verification)
CREATE TABLE otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Activity Logs Table
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Refunds Table
CREATE TABLE refunds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason_code TEXT NOT NULL,
  explanation TEXT,
  evidence_urls TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. User Addresses Table
CREATE TABLE user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  region TEXT NOT NULL,
  province TEXT NOT NULL,
  city TEXT NOT NULL,
  barangay TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  street_address TEXT NOT NULL,
  label TEXT CHECK (label IN ('Home', 'Work')) DEFAULT 'Home',
  lat NUMERIC,
  lng NUMERIC,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own addresses" ON user_addresses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own addresses" ON user_addresses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own addresses" ON user_addresses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own addresses" ON user_addresses FOR DELETE USING (auth.uid() = user_id);

-- Function to handle is_default logic
CREATE OR REPLACE FUNCTION handle_default_address()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default THEN
    UPDATE user_addresses
    SET is_default = false
    WHERE user_id = NEW.user_id AND id <> NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_address
BEFORE INSERT OR UPDATE ON user_addresses
FOR EACH ROW EXECUTE FUNCTION handle_default_address();

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on promotions" ON promotions FOR SELECT USING (true);
CREATE POLICY "Admins can manage promotions" ON promotions FOR ALL USING (is_admin());

ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own refunds" ON refunds FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own refunds" ON refunds FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all refunds" ON refunds FOR SELECT USING (is_admin());
CREATE POLICY "Admins can update all refunds" ON refunds FOR UPDATE USING (is_admin());

-- RLS Policies for OTPs (Internal use only, but let's be safe)
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
-- No public access to OTPs

-- RLS Policies for Activity Logs
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view all activity logs" ON activity_logs FOR SELECT USING (is_admin());
CREATE POLICY "Admins can insert activity logs" ON activity_logs FOR INSERT WITH CHECK (is_admin());

-- 7. Chats Table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_ai_active BOOLEAN DEFAULT true,
  status TEXT CHECK (status IN ('active', 'closed')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Chat Messages Table
CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id UUID REFERENCES chats ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  role TEXT CHECK (role IN ('user', 'bot', 'admin')) NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- RLS Policies for Chats
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chats" ON chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own chats" ON chats FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view unassigned or their own chats" ON chats FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND (
      p.role = 'owner' OR
      (p.role = 'admin' AND (assigned_admin_id IS NULL OR assigned_admin_id = auth.uid()))
    )
  )
);

CREATE POLICY "Admins can update unassigned or their own chats" ON chats FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = auth.uid()
    AND (
      p.role = 'owner' OR
      (p.role = 'admin' AND (assigned_admin_id IS NULL OR assigned_admin_id = auth.uid()))
    )
  )
);

-- RLS Policies for Chat Messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their chats" ON chat_messages FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = chat_messages.chat_id
    AND (chats.user_id = auth.uid() OR chats.assigned_admin_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'owner'
    ) OR (chats.assigned_admin_id IS NULL AND EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )))
  )
);

CREATE POLICY "Users can insert messages in their chats" ON chat_messages FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM chats
    WHERE chats.id = chat_messages.chat_id
    AND (chats.user_id = auth.uid() OR chats.assigned_admin_id = auth.uid() OR EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'owner'
    ) OR (chats.assigned_admin_id IS NULL AND EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'
    )))
  )
);

-- 9. Supabase Storage Setup (for product-images bucket)
-- Note: This assumes the storage schema and buckets table exist (default in Supabase)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true), ('promo-banners', 'promo-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
-- Allow public read access to product images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('product-images', 'promo-banners') );

-- Allow admins and owners to upload/manage images
CREATE POLICY "Admin/Owner Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id IN ('product-images', 'promo-banners') AND
  (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'owner')
  ))
);

CREATE POLICY "Admin/Owner Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id IN ('product-images', 'promo-banners') AND
  (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'owner')
  ))
);

CREATE POLICY "Admin/Owner Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id IN ('product-images', 'promo-banners') AND
  (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'owner')
  ))
);

-- Seed Data (Real Products with PHP Pricing)
TRUNCATE TABLE products CASCADE;

INSERT INTO products (name, description, price, stock_quantity, category, parent_category, specs, image_url, gallery_urls, is_new, is_deal, promotion_label, discount_price)
VALUES 
-- CPUs
('AMD Ryzen 7 7800X3D', 'The ultimate gaming processor with 3D V-Cache technology.', 24500, 25, 'CPU', 'Core Components', '{"socket": "AM5", "cores": 8, "threads": 16, "wattage": 120}', '', ARRAY['', ''], true, false, 'Best for Gaming', NULL),
('Intel Core i9-14900K', 'The fastest desktop processor for enthusiasts and creators.', 34500, 15, 'CPU', 'Core Components', '{"socket": "LGA1700", "cores": 24, "threads": 32, "wattage": 125}', '', ARRAY['', ''], true, false, 'Flagship', NULL),
('Intel Core i7-14700K', 'High-performance processor with 20 cores, perfect for high-end gaming.', 25800, 20, 'CPU', 'Core Components', '{"socket": "LGA1700", "cores": 20, "threads": 28, "wattage": 125}', '', ARRAY[''], false, false, NULL, NULL),

-- GPUs
('NVIDIA GeForce RTX 4080 Super', 'High-performance graphics card for 4K gaming and creative work.', 68500, 10, 'GPU', 'Core Components', '{"chipset": "RTX 4080 Super", "vram": "16GB GDDR6X", "wattage": 320}', '', ARRAY['', ''], true, true, 'Hot Deal', 65000),
('NVIDIA GeForce RTX 4070 Super', 'The sweet spot for 1440p gaming with DLSS 3 support.', 38500, 20, 'GPU', 'Core Components', '{"chipset": "RTX 4070 Super", "vram": "12GB GDDR6X", "wattage": 220}', '', ARRAY[''], true, true, 'Best Value', 36500),
('AMD Radeon RX 7900 XTX', 'AMD''s flagship graphics card with 24GB of memory.', 62000, 12, 'GPU', 'Core Components', '{"chipset": "RX 7900 XTX", "vram": "24GB GDDR6", "wattage": 355}', '', ARRAY[''], false, false, 'AMD Flagship', NULL),

-- Motherboards
('ASUS ROG Strix B650-A Gaming WiFi', 'Premium AM5 motherboard with white aesthetics and WiFi 6E.', 14800, 15, 'Motherboard', 'Core Components', '{"socket": "AM5", "form_factor": "ATX", "chipset": "B650"}', '', ARRAY[''], false, false, NULL, NULL),
('MSI MAG Z790 Tomahawk WiFi', 'Reliable and high-performance motherboard for Intel 14th Gen.', 16500, 20, 'Motherboard', 'Core Components', '{"socket": "LGA1700", "form_factor": "ATX", "chipset": "Z790"}', '', ARRAY[''], false, false, NULL, NULL),

-- RAM
('Corsair Vengeance RGB 32GB DDR5-6000', 'High-speed DDR5 memory with vibrant RGB lighting.', 8200, 40, 'RAM', 'Core Components', '{"capacity": "32GB", "speed": "6000MHz", "type": "DDR5"}', '', ARRAY[''], false, true, 'Sale', 7800),
('G.Skill Trident Z5 RGB 64GB DDR5-6400', 'Massive capacity and speed for heavy multitasking.', 15800, 10, 'RAM', 'Core Components', '{"capacity": "64GB", "speed": "6400MHz", "type": "DDR5"}', '', ARRAY[''], true, false, 'High Capacity', NULL),

-- Storage
('Samsung 990 Pro 2TB NVMe SSD', 'Blazing fast PCIe 4.0 storage for quick load times.', 11500, 30, 'Storage', 'Core Components', '{"capacity": "2TB", "interface": "PCIe 4.0", "type": "NVMe"}', '', ARRAY[''], true, false, 'Top Rated', NULL),
('WD Black SN850X 2TB', 'High-performance gaming SSD with optional heatsink.', 10200, 25, 'Storage', 'Core Components', '{"capacity": "2TB", "interface": "PCIe 4.0", "type": "NVMe"}', '', ARRAY[''], false, false, 'Gamer Choice', NULL),

-- PSUs
('Corsair RM850e 850W Gold PSU', 'Fully modular, low-noise power supply with 80 Plus Gold efficiency.', 7200, 20, 'PSU', 'Core Components', '{"wattage": 850, "efficiency": "80+ Gold", "modular": "Full"}', '', ARRAY[''], false, false, NULL, NULL),
('Seasonic Focus GX-1000 1000W', 'High-quality 1000W power supply for high-end builds.', 10500, 15, 'PSU', 'Core Components', '{"wattage": 1000, "efficiency": "80+ Gold", "modular": "Full"}', '', ARRAY[''], false, false, NULL, NULL),

-- Cases
('Lian Li O11 Dynamic EVO (White)', 'Iconic dual-chamber chassis with modular design.', 9800, 12, 'Case', 'Core Components', '{"type": "Mid Tower", "color": "White", "side_panel": "Tempered Glass"}', '', ARRAY[''], false, false, 'Popular', NULL),
('NZXT H9 Flow (Black)', 'Dual-chamber mid-tower case with massive glass panels.', 11200, 10, 'Case', 'Core Components', '{"type": "Mid Tower", "color": "Black", "side_panel": "Tempered Glass"}', '', ARRAY[''], true, false, 'Aesthetic', NULL),

-- Coolers
('DeepCool LT720 360mm AIO', 'High-performance liquid cooler with multidimensional infinity mirror design.', 6800, 18, 'Cooler', 'Core Components', '{"type": "Liquid", "size": "360mm"}', '', ARRAY[''], false, true, 'Promo', 6200),
('Noctua NH-D15', 'The legendary dual-tower air cooler for maximum cooling performance.', 5500, 15, 'Cooler', 'Core Components', '{"type": "Air", "fans": 2}', '', ARRAY[''], false, false, 'Silent King', NULL),

-- Peripherals
('MCHOSE Jet 75', 'Premium 75% mechanical keyboard with KTT White switches.', 4200, 25, 'Peripherals', 'Peripherals', '{"type": "Keyboard", "layout": "75%", "switches": "KTT White"}', '', ARRAY[''], true, false, 'New Arrival', NULL),
('Logitech G Pro X Superlight 2', 'The world''s most popular wireless gaming mouse.', 8500, 25, 'Peripherals', 'Peripherals', '{"type": "Mouse", "wireless": true, "weight": "60g"}', '', ARRAY[''], true, false, 'Pro Choice', NULL);

-- 13. Saved Builds Table
CREATE TABLE saved_builds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  build_name TEXT NOT NULL,
  components_json JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE saved_builds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own saved builds" ON saved_builds FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own saved builds" ON saved_builds FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own saved builds" ON saved_builds FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saved builds" ON saved_builds FOR DELETE USING (auth.uid() = user_id);
