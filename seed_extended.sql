-- PC Beep Extended Inventory Seed Data (2026 Philippine Market)
-- 10 Products per category

INSERT INTO products (name, description, price, stock_quantity, category, parent_category, specs, image_url, is_new, is_deal, promotion_label) VALUES

-- ==========================================
-- 1. Gaming Laptops (Parent: Laptops)
-- ==========================================
('ASUS ROG Strix SCAR 18 (2026)', 'Intel Core Ultra 9, RTX 5090, 64GB DDR5, 4TB SSD, 18" 4K 240Hz Mini-LED.', 285000, 5, 'Gaming Laptops', 'Laptops', '{"cpu": "Ultra 9 285H", "gpu": "RTX 5090 Mobile", "ram": "64GB", "storage": "4TB", "screen": "18\\" 4K Mini-LED"}', 'https://picsum.photos/seed/glap1/600/600', true, false, 'Ultimate Gaming'),
('MSI Titan GT77 HX (2026)', 'The desktop replacement with mechanical keyboard and 4K OLED.', 315000, 3, 'Gaming Laptops', 'Laptops', '{"cpu": "Ultra 9 285H", "gpu": "RTX 5090 Mobile", "ram": "128GB", "storage": "8TB"}', 'https://picsum.photos/seed/glap2/600/600', true, false, 'Desktop Replacement'),
('Razer Blade 16 (2026)', 'Sleek Blackwell performance with dual-mode Mini-LED display.', 245000, 8, 'Gaming Laptops', 'Laptops', '{"cpu": "Ultra 9", "gpu": "RTX 5080 Mobile", "ram": "32GB"}', 'https://picsum.photos/seed/glap3/600/600', true, false, 'Premium Thin'),
('Lenovo Legion Pro 7i Gen 11', 'Balanced performance with AI-tuned cooling.', 165000, 15, 'Gaming Laptops', 'Laptops', '{"cpu": "Ultra 7", "gpu": "RTX 5070 Mobile", "ram": "32GB"}', 'https://picsum.photos/seed/glap4/600/600', true, true, 'Best Seller'),
('ASUS TUF Gaming A15 (2026)', 'Ryzen 9 9000 series and RTX 5060 for the masses.', 85000, 25, 'Gaming Laptops', 'Laptops', '{"cpu": "Ryzen 9 9900H", "gpu": "RTX 5060 Mobile", "ram": "16GB"}', 'https://picsum.photos/seed/glap5/600/600', true, false, 'Value King'),
('HP Victus 16 (2026)', 'Clean design with powerful internals.', 72000, 30, 'Gaming Laptops', 'Laptops', '{"cpu": "Ultra 5", "gpu": "RTX 5050 Mobile", "ram": "16GB"}', 'https://picsum.photos/seed/glap6/600/600', true, false, 'Budget Gaming'),
('Acer Predator Helios Neo 16', 'High refresh rate gaming at a competitive price.', 92000, 20, 'Gaming Laptops', 'Laptops', '{"cpu": "Ultra 7", "gpu": "RTX 5060 Mobile"}', 'https://picsum.photos/seed/glap7/600/600', true, false, 'Mid-Range'),
('Gigabyte AORUS 17X (2026)', 'Massive 17" screen with top-tier Blackwell GPU.', 215000, 6, 'Gaming Laptops', 'Laptops', '{"cpu": "Ultra 9", "gpu": "RTX 5080 Mobile"}', 'https://picsum.photos/seed/glap8/600/600', true, false, 'Large Screen'),
('Dell Alienware m18 R3', 'Iconic design with extreme cooling.', 265000, 4, 'Gaming Laptops', 'Laptops', '{"cpu": "Ultra 9", "gpu": "RTX 5090 Mobile"}', 'https://picsum.photos/seed/glap9/600/600', true, false, 'Alienware'),
('MSI Katana 15 (2026)', 'Sharp performance for entry-level enthusiasts.', 65000, 40, 'Gaming Laptops', 'Laptops', '{"cpu": "Ultra 5", "gpu": "RTX 5050 Mobile"}', 'https://picsum.photos/seed/glap10/600/600', true, true, 'Promo'),

-- ==========================================
-- 2. Office Laptops (Parent: Laptops)
-- ==========================================
('Dell XPS 13 (2026)', 'The ultimate ultraportable with Intel Core Ultra 7.', 95000, 15, 'Office Laptops', 'Laptops', '{"cpu": "Ultra 7", "ram": "32GB", "storage": "1TB", "weight": "1.1kg"}', 'https://picsum.photos/seed/olap1/600/600', true, false, 'Executive'),
('MacBook Air M4 (13-inch)', 'Blazing fast M4 chip in a silent, fanless design.', 72000, 50, 'Office Laptops', 'Laptops', '{"cpu": "Apple M4", "ram": "16GB", "storage": "512GB"}', 'https://picsum.photos/seed/olap2/600/600', true, false, 'Apple Silicon'),
('HP Spectre x360 14', 'Premium 2-in-1 with stunning OLED touch display.', 88000, 12, 'Office Laptops', 'Laptops', '{"cpu": "Ultra 7", "ram": "16GB", "screen": "OLED Touch"}', 'https://picsum.photos/seed/olap3/600/600', true, false, 'Versatile'),
('Lenovo ThinkPad X1 Carbon Gen 14', 'The gold standard for business professionals.', 115000, 20, 'Office Laptops', 'Laptops', '{"cpu": "Ultra 7", "ram": "32GB", "security": "vPro"}', 'https://picsum.photos/seed/olap4/600/600', true, false, 'Business Pro'),
('ASUS Zenbook S 13 OLED', 'World''s thinnest 13" OLED laptop.', 79000, 25, 'Office Laptops', 'Laptops', '{"cpu": "Ultra 5", "weight": "1kg"}', 'https://picsum.photos/seed/olap5/600/600', true, true, 'Thin & Light'),
('Microsoft Surface Laptop 7', 'Clean, elegant, and powerful with AI features.', 82000, 18, 'Office Laptops', 'Laptops', '{"cpu": "Snapdragon X Elite", "ram": "16GB"}', 'https://picsum.photos/seed/olap6/600/600', true, false, 'Copilot+ PC'),
('Acer Swift Go 14', 'Great value OLED laptop for everyday work.', 48000, 40, 'Office Laptops', 'Laptops', '{"cpu": "Ultra 5", "screen": "OLED"}', 'https://picsum.photos/seed/olap7/600/600', false, true, 'Best Value'),
('LG Gram 16 (2026)', 'Incredibly light 16" laptop for productivity.', 85000, 10, 'Office Laptops', 'Laptops', '{"cpu": "Ultra 7", "weight": "1.2kg"}', 'https://picsum.photos/seed/olap8/600/600', true, false, 'Large & Light'),
('Samsung Galaxy Book 5 Pro', 'Seamless integration with Galaxy ecosystem.', 92000, 8, 'Office Laptops', 'Laptops', '{"cpu": "Ultra 7", "screen": "AMOLED"}', 'https://picsum.photos/seed/olap9/600/600', true, false, 'Ecosystem'),
('Huawei MateBook X Pro (2026)', 'Stunning design with powerful performance.', 105000, 5, 'Office Laptops', 'Laptops', '{"cpu": "Ultra 9", "weight": "980g"}', 'https://picsum.photos/seed/olap10/600/600', true, false, 'Ultra Premium'),

-- ==========================================
-- 3. Student Laptops (Parent: Laptops)
-- ==========================================
('ASUS Vivobook 16', 'Large screen and reliable performance for students.', 38000, 60, 'Student Laptops', 'Laptops', '{"cpu": "Ryzen 7", "ram": "16GB", "storage": "512GB"}', 'https://picsum.photos/seed/slap1/600/600', false, true, 'Student Choice'),
('Acer Aspire 5 (2026)', 'The classic budget-friendly student laptop.', 28000, 100, 'Student Laptops', 'Laptops', '{"cpu": "Intel Core 5", "ram": "8GB"}', 'https://picsum.photos/seed/slap2/600/600', true, false, 'Budget Friendly'),
('Lenovo IdeaPad Slim 3', 'Thin, light, and perfect for carrying to class.', 32000, 80, 'Student Laptops', 'Laptops', '{"cpu": "Ryzen 5", "ram": "16GB"}', 'https://picsum.photos/seed/slap3/600/600', false, false, 'Portable'),
('HP Laptop 15', 'Reliable everyday performance for school work.', 35000, 70, 'Student Laptops', 'Laptops', '{"cpu": "Intel Core 5", "ram": "16GB"}', 'https://picsum.photos/seed/slap4/600/600', false, false, 'Reliable'),
('Dell Inspiron 14', 'Solid build quality with modern features.', 42000, 45, 'Student Laptops', 'Laptops', '{"cpu": "Ultra 5", "ram": "16GB"}', 'https://picsum.photos/seed/slap5/600/600', true, false, 'Durable'),
('MSI Modern 14', 'Stylish and compact for the modern student.', 34000, 55, 'Student Laptops', 'Laptops', '{"cpu": "Ryzen 5", "weight": "1.4kg"}', 'https://picsum.photos/seed/slap6/600/600', false, true, 'Stylish'),
('ASUS Chromebook Plus', 'Fast, secure, and easy to use for online learning.', 22000, 40, 'Student Laptops', 'Laptops', '{"cpu": "Intel Core 3", "os": "ChromeOS"}', 'https://picsum.photos/seed/slap7/600/600', true, false, 'Cloud Ready'),
('Acer Swift 3', 'Premium feel at a student-friendly price.', 45000, 30, 'Student Laptops', 'Laptops', '{"cpu": "Ultra 5", "ram": "16GB"}', 'https://picsum.photos/seed/slap8/600/600', false, false, 'Premium Value'),
('Lenovo Yoga 7i', 'Flexible 2-in-1 for note-taking and creativity.', 58000, 20, 'Student Laptops', 'Laptops', '{"cpu": "Ultra 5", "screen": "Touch 2-in-1"}', 'https://picsum.photos/seed/slap9/600/600', true, false, 'Creative'),
('HP Pavilion Aero 13', 'Ultra-lightweight for the busy student.', 48000, 25, 'Student Laptops', 'Laptops', '{"cpu": "Ryzen 7", "weight": "970g"}', 'https://picsum.photos/seed/slap10/600/600', false, true, 'Lightest'),

-- ==========================================
-- 4. Gaming PCs (Parent: Pre-built PCs)
-- ==========================================
('Beep PC Ultimate Blackwell', 'RTX 5090, Ultra 9 285K, 64GB DDR5, Custom Loop.', 350000, 2, 'Gaming PCs', 'Pre-built PCs', '{"cpu": "Ultra 9 285K", "gpu": "RTX 5090", "ram": "64GB", "psu": "1200W"}', 'https://picsum.photos/seed/gpc1/600/600', true, false, 'Extreme'),
('Beep PC Pro Gamer', 'RTX 5080, Ultra 7 265K, 32GB DDR5, 2TB NVMe.', 185000, 5, 'Gaming PCs', 'Pre-built PCs', '{"cpu": "Ultra 7 265K", "gpu": "RTX 5080", "ram": "32GB"}', 'https://picsum.photos/seed/gpc2/600/600', true, false, 'Pro Choice'),
('Beep PC Streamer Edition', 'Ryzen 9 9900X, RTX 5070, 32GB DDR5, Dual SSD.', 145000, 8, 'Gaming PCs', 'Pre-built PCs', '{"cpu": "Ryzen 9 9900X", "gpu": "RTX 5070", "ram": "32GB"}', 'https://picsum.photos/seed/gpc3/600/600', true, true, 'Streamer Ready'),
('Beep PC Value Gamer', 'RTX 5060 Ti, Ultra 5 245K, 16GB DDR5.', 85000, 15, 'Gaming PCs', 'Pre-built PCs', '{"cpu": "Ultra 5 245K", "gpu": "RTX 5060 Ti", "ram": "16GB"}', 'https://picsum.photos/seed/gpc4/600/600', true, false, 'Best Value'),
('Beep PC Entry Gamer', 'RTX 5060, Ryzen 5 9600X, 16GB DDR5.', 68000, 20, 'Gaming PCs', 'Pre-built PCs', '{"cpu": "Ryzen 5 9600X", "gpu": "RTX 5060", "ram": "16GB"}', 'https://picsum.photos/seed/gpc5/600/600', true, false, 'Starter'),
('Beep PC White Aesthetic', 'All-white build with RTX 5070 and RGB.', 155000, 4, 'Gaming PCs', 'Pre-built PCs', '{"cpu": "Ultra 7", "gpu": "RTX 5070 White", "color": "White"}', 'https://picsum.photos/seed/gpc6/600/600', true, false, 'Aesthetic'),
('Beep PC Mini Beast', 'ITX build with RTX 5080 and Ultra 7.', 195000, 3, 'Gaming PCs', 'Pre-built PCs', '{"cpu": "Ultra 7", "gpu": "RTX 5080", "form": "ITX"}', 'https://picsum.photos/seed/gpc7/600/600', true, false, 'Compact'),
('Beep PC AMD Advantage', 'Ryzen 9 9950X, RX 8900 XTX, 64GB DDR5.', 225000, 3, 'Gaming PCs', 'Pre-built PCs', '{"cpu": "Ryzen 9 9950X", "gpu": "RX 8900 XTX"}', 'https://picsum.photos/seed/gpc8/600/600', true, false, 'Full AMD'),
('Beep PC Esports Pro', 'Ultra 7, RTX 5070, 360Hz Monitor Bundle.', 175000, 6, 'Gaming PCs', 'Pre-built PCs', '{"cpu": "Ultra 7", "gpu": "RTX 5070", "optimized": "Esports"}', 'https://picsum.photos/seed/gpc9/600/600', true, false, 'Esports'),
('Beep PC Budget King', 'RTX 4060, Ryzen 5 7600, 16GB DDR5.', 55000, 25, 'Gaming PCs', 'Pre-built PCs', '{"cpu": "Ryzen 5 7600", "gpu": "RTX 4060"}', 'https://picsum.photos/seed/gpc10/600/600', false, true, 'Clearance'),

-- ==========================================
-- 5. Workstations (Parent: Pre-built PCs)
-- ==========================================
('Beep PC Threadripper Pro', 'Threadripper 7995WX, 256GB RAM, RTX 6000 Ada.', 1250000, 1, 'Workstations', 'Pre-built PCs', '{"cpu": "TR 7995WX", "ram": "256GB ECC", "gpu": "RTX 6000 Ada"}', 'https://picsum.photos/seed/ws1/600/600', false, false, 'Ultimate Workstation'),
('Beep PC AI Researcher', 'Dual RTX 5090, Ultra 9 285K, 128GB RAM.', 450000, 2, 'Workstations', 'Pre-built PCs', '{"cpu": "Ultra 9 285K", "gpu": "2x RTX 5090", "ram": "128GB"}', 'https://picsum.photos/seed/ws2/600/600', true, false, 'AI Ready'),
('Beep PC Video Editor 8K', 'Ultra 9, RTX 5080, 64GB RAM, 10TB Storage.', 245000, 4, 'Workstations', 'Pre-built PCs', '{"cpu": "Ultra 9", "gpu": "RTX 5080", "storage": "10TB"}', 'https://picsum.photos/seed/ws3/600/600', true, false, 'Video Pro'),
('Beep PC Architect Pro', 'Ultra 7, RTX 4000 Ada, 64GB RAM.', 185000, 5, 'Workstations', 'Pre-built PCs', '{"cpu": "Ultra 7", "gpu": "RTX 4000 Ada"}', 'https://picsum.photos/seed/ws4/600/600', true, false, 'CAD Optimized'),
('Beep PC Developer Studio', 'Ryzen 9 9950X, 128GB RAM, RTX 5070.', 165000, 6, 'Workstations', 'Pre-built PCs', '{"cpu": "Ryzen 9 9950X", "ram": "128GB"}', 'https://picsum.photos/seed/ws5/600/600', true, false, 'Dev Power'),
('Beep PC 3D Modeler', 'Ultra 7, RTX 5070 Ti, 32GB RAM.', 135000, 8, 'Workstations', 'Pre-built PCs', '{"cpu": "Ultra 7", "gpu": "RTX 5070 Ti"}', 'https://picsum.photos/seed/ws6/600/600', true, false, '3D Ready'),
('Beep PC Audio Engineer', 'Ultra 5, 64GB RAM, Silent Cooling, 4TB SSD.', 95000, 5, 'Workstations', 'Pre-built PCs', '{"cpu": "Ultra 5", "ram": "64GB", "silent": true}', 'https://picsum.photos/seed/ws7/600/600', true, false, 'Studio Silent'),
('Beep PC Data Scientist', 'Ryzen 9, RTX 5080, 64GB RAM.', 195000, 4, 'Workstations', 'Pre-built PCs', '{"cpu": "Ryzen 9", "gpu": "RTX 5080"}', 'https://picsum.photos/seed/ws8/600/600', true, false, 'Data Pro'),
('Beep PC Rendering Node', 'Dual Ryzen 9 7950X, 128GB RAM.', 215000, 3, 'Workstations', 'Pre-built PCs', '{"cpu": "2x Ryzen 9 7950X"}', 'https://picsum.photos/seed/ws9/600/600', false, false, 'Render Node'),
('Beep PC Entry Workstation', 'Ultra 5, RTX 5060, 32GB RAM.', 85000, 10, 'Workstations', 'Pre-built PCs', '{"cpu": "Ultra 5", "gpu": "RTX 5060"}', 'https://picsum.photos/seed/ws10/600/600', true, true, 'Value Work'),

-- ==========================================
-- 6. Budget PCs (Parent: Pre-built PCs)
-- ==========================================
('Beep PC Home Office', 'Intel Core 5, 16GB RAM, 512GB SSD.', 28000, 50, 'Budget PCs', 'Pre-built PCs', '{"cpu": "Intel Core 5", "ram": "16GB"}', 'https://picsum.photos/seed/bpc1/600/600', false, false, 'Home Office'),
('Beep PC Student Starter', 'Ryzen 5, 16GB RAM, 512GB SSD.', 26000, 60, 'Budget PCs', 'Pre-built PCs', '{"cpu": "Ryzen 5", "ram": "16GB"}', 'https://picsum.photos/seed/bpc2/600/600', false, true, 'Student Deal'),
('Beep PC Mini Office', 'Intel Core 3, 8GB RAM, 256GB SSD, Tiny Form Factor.', 18000, 40, 'Budget PCs', 'Pre-built PCs', '{"cpu": "Intel Core 3", "form": "Mini"}', 'https://picsum.photos/seed/bpc3/600/600', false, false, 'Space Saver'),
('Beep PC Media Center', 'Ryzen 3, 8GB RAM, 1TB HDD + 256GB SSD.', 22000, 30, 'Budget PCs', 'Pre-built PCs', '{"cpu": "Ryzen 3", "storage": "1.25TB"}', 'https://picsum.photos/seed/bpc4/600/600', false, false, 'Media'),
('Beep PC Basic Web', 'Intel Pentium Gold, 8GB RAM, 256GB SSD.', 15000, 100, 'Budget PCs', 'Pre-built PCs', '{"cpu": "Pentium Gold"}', 'https://picsum.photos/seed/bpc5/600/600', false, false, 'Basic'),
('Beep PC School Lab', 'Intel Core 5, 8GB RAM, 256GB SSD.', 24000, 200, 'Budget PCs', 'Pre-built PCs', '{"cpu": "Intel Core 5"}', 'https://picsum.photos/seed/bpc6/600/600', false, false, 'Bulk Ready'),
('Beep PC Linux Box', 'Ryzen 5, 16GB RAM, No OS.', 23000, 20, 'Budget PCs', 'Pre-built PCs', '{"cpu": "Ryzen 5", "os": "None"}', 'https://picsum.photos/seed/bpc7/600/600', false, false, 'Linux'),
('Beep PC POS System', 'Intel Celeron, 4GB RAM, 128GB SSD.', 12000, 50, 'Budget PCs', 'Pre-built PCs', '{"cpu": "Celeron"}', 'https://picsum.photos/seed/bpc8/600/600', false, false, 'POS'),
('Beep PC Elderly Friendly', 'Intel Core 5, 16GB RAM, Large Icons Setup.', 29000, 15, 'Budget PCs', 'Pre-built PCs', '{"cpu": "Intel Core 5"}', 'https://picsum.photos/seed/bpc9/600/600', false, false, 'Easy Use'),
('Beep PC Refurbished Pro', 'Intel Core i7 (12th Gen), 16GB RAM.', 19000, 10, 'Budget PCs', 'Pre-built PCs', '{"cpu": "i7-12700"}', 'https://picsum.photos/seed/bpc10/600/600', false, true, 'Refurbished'),

-- ==========================================
-- 7. Air Cooling (Parent: Cooling)
-- ==========================================
('Noctua NH-D15 G2', 'The new king of air cooling.', 8500, 20, 'Air Cooling', 'Cooling', '{"type": "Air", "fans": 2, "wattage": 250}', 'https://picsum.photos/seed/ac1/600/600', true, false, 'Silent King'),
('Be Quiet! Dark Rock Pro 5', 'Virtually inaudible high-end air cooling.', 6200, 25, 'Air Cooling', 'Cooling', '{"type": "Air", "noise": "Low"}', 'https://picsum.photos/seed/ac2/600/600', false, false, 'Silent'),
('Thermalright Peerless Assassin 120 SE', 'The budget air cooling champion.', 2400, 100, 'Air Cooling', 'Cooling', '{"type": "Air", "fans": 2}', 'https://picsum.photos/seed/ac3/600/600', false, true, 'Budget King'),
('DeepCool AK620 Digital', 'Air cooler with real-time status display.', 4500, 40, 'Air Cooling', 'Cooling', '{"type": "Air", "display": "Digital"}', 'https://picsum.photos/seed/ac4/600/600', false, false, 'Smart'),
('Cooler Master Hyper 212 Halo', 'The classic updated with vibrant RGB.', 2800, 80, 'Air Cooling', 'Cooling', '{"type": "Air", "rgb": true}', 'https://picsum.photos/seed/ac5/600/600', false, false, 'Classic'),
('Noctua NH-U12A chromax.black', 'Premium 120mm air cooler in all black.', 7500, 15, 'Air Cooling', 'Cooling', '{"type": "Air", "color": "Black"}', 'https://picsum.photos/seed/ac6/600/600', false, false, 'Premium'),
('Arctic Freezer 36', 'Efficient and affordable single tower.', 1800, 120, 'Air Cooling', 'Cooling', '{"type": "Air"}', 'https://picsum.photos/seed/ac7/600/600', true, false, 'New Value'),
('ID-COOLING SE-224-XTS Black', 'Sleek budget air cooler.', 1200, 150, 'Air Cooling', 'Cooling', '{"type": "Air"}', 'https://picsum.photos/seed/ac8/600/600', false, false, 'Budget'),
('Scythe Fuma 3', 'Compact dual tower with great clearance.', 3800, 30, 'Air Cooling', 'Cooling', '{"type": "Air", "fans": 2}', 'https://picsum.photos/seed/ac9/600/600', true, false, 'Compact Dual'),
('Noctua NH-L9i-17xx chromax.black', 'Low profile cooler for ITX builds.', 3500, 20, 'Air Cooling', 'Cooling', '{"type": "Air", "low_profile": true}', 'https://picsum.photos/seed/ac10/600/600', false, false, 'ITX Choice'),

-- ==========================================
-- 8. Liquid Cooling (Parent: Cooling)
-- ==========================================
('DeepCool LT720 360mm AIO', 'High-performance liquid cooler with infinity mirror.', 6800, 30, 'Liquid Cooling', 'Cooling', '{"type": "Liquid", "size": "360mm", "wattage": 300}', 'https://picsum.photos/seed/lc1/600/600', false, true, 'Top Performance'),
('Arctic Liquid Freezer III 360', 'Unbeatable value and performance AIO.', 7200, 40, 'Liquid Cooling', 'Cooling', '{"type": "Liquid", "size": "360mm"}', 'https://picsum.photos/seed/lc2/600/600', true, false, 'Value AIO'),
('NZXT Kraken Elite 360 RGB', 'AIO with customizable LCD display.', 18500, 15, 'Liquid Cooling', 'Cooling', '{"type": "Liquid", "size": "360mm", "screen": "LCD"}', 'https://picsum.photos/seed/lc3/600/600', false, false, 'Premium'),
('Lian Li Galahad II LCD 360', 'High performance AIO with vibrant LCD.', 16500, 12, 'Liquid Cooling', 'Cooling', '{"type": "Liquid", "size": "360mm"}', 'https://picsum.photos/seed/lc4/600/600', true, false, 'Stylish'),
('Corsair iCUE Link H150i RGB', 'Smart AIO with simplified cabling.', 14500, 20, 'Liquid Cooling', 'Cooling', '{"type": "Liquid", "size": "360mm"}', 'https://picsum.photos/seed/lc5/600/600', false, false, 'Smart Link'),
('MSI MAG CoreLiquid E360', 'Reliable and stylish liquid cooling.', 5800, 35, 'Liquid Cooling', 'Cooling', '{"type": "Liquid", "size": "360mm"}', 'https://picsum.photos/seed/lc6/600/600', false, true, 'Sale'),
('ASUS ROG Ryujin III 360 ARGB', 'Extreme cooling with Noctua fans and LCD.', 24500, 5, 'Liquid Cooling', 'Cooling', '{"type": "Liquid", "size": "360mm", "fans": "Noctua"}', 'https://picsum.photos/seed/lc7/600/600', false, false, 'Extreme'),
('Cooler Master MasterLiquid 360L Core', 'Essential liquid cooling performance.', 4200, 50, 'Liquid Cooling', 'Cooling', '{"type": "Liquid", "size": "360mm"}', 'https://picsum.photos/seed/lc8/600/600', false, false, 'Budget AIO'),
('Phanteks Glacier One 360MPH', 'Elegant design with high performance.', 9500, 10, 'Liquid Cooling', 'Cooling', '{"type": "Liquid", "size": "360mm"}', 'https://picsum.photos/seed/lc9/600/600', false, false, 'Elegant'),
('Valkyrie V360 ARGB', 'Newcomer with incredible performance.', 8200, 15, 'Liquid Cooling', 'Cooling', '{"type": "Liquid", "size": "360mm"}', 'https://picsum.photos/seed/lc10/600/600', true, false, 'Newcomer'),

-- ==========================================
-- 9. Case Fans (Parent: Cooling)
-- ==========================================
('Lian Li UNI Fan TL LCD 120', 'Fan with integrated LCD screen.', 3200, 40, 'Case Fans', 'Cooling', '{"type": "Fan", "size": "120mm", "screen": "LCD"}', 'https://picsum.photos/seed/fan1/600/600', true, false, 'LCD Fan'),
('Noctua NF-A12x25 PWM', 'The ultimate 120mm fan.', 2200, 100, 'Case Fans', 'Cooling', '{"type": "Fan", "size": "120mm", "performance": "High"}', 'https://picsum.photos/seed/fan2/600/600', false, false, 'Performance King'),
('Arctic P12 PWM PST (5-Pack)', 'Unbeatable value for bulk fans.', 2500, 80, 'Case Fans', 'Cooling', '{"type": "Fan", "size": "120mm", "quantity": 5}', 'https://picsum.photos/seed/fan3/600/600', false, true, 'Value Pack'),
('Lian Li UNI Fan SL-Infinity 120', 'Stunning infinity mirror RGB fans.', 2400, 60, 'Case Fans', 'Cooling', '{"type": "Fan", "size": "120mm", "rgb": "Infinity"}', 'https://picsum.photos/seed/fan4/600/600', false, false, 'Aesthetic'),
('Be Quiet! Silent Wings 4 Pro', 'Silent and powerful.', 1800, 50, 'Case Fans', 'Cooling', '{"type": "Fan", "size": "120mm", "noise": "Ultra Low"}', 'https://picsum.photos/seed/fan5/600/600', false, false, 'Silent'),
('Corsair iCUE Link QX120 RGB', 'Smart fans with easy daisy-chaining.', 2800, 40, 'Case Fans', 'Cooling', '{"type": "Fan", "size": "120mm", "smart": true}', 'https://picsum.photos/seed/fan6/600/600', false, false, 'Smart Fan'),
('Phanteks D30-120', 'High performance with hidden screw design.', 2100, 30, 'Case Fans', 'Cooling', '{"type": "Fan", "size": "120mm"}', 'https://picsum.photos/seed/fan7/600/600', true, false, 'Clean Look'),
('Noctua NF-P12 redux-1700', 'Affordable Noctua performance.', 950, 150, 'Case Fans', 'Cooling', '{"type": "Fan", "size": "120mm"}', 'https://picsum.photos/seed/fan8/600/600', false, false, 'Budget Noctua'),
('Cooler Master SickleFlow 120 RGB', 'Standard RGB fan.', 650, 200, 'Case Fans', 'Cooling', '{"type": "Fan", "size": "120mm"}', 'https://picsum.photos/seed/fan9/600/600', false, false, 'Basic RGB'),
('Thermalright TL-C12C-S (3-Pack)', 'Incredible budget RGB pack.', 900, 100, 'Case Fans', 'Cooling', '{"type": "Fan", "size": "120mm", "quantity": 3}', 'https://picsum.photos/seed/fan10/600/600', false, true, 'Budget Pack'),

-- ==========================================
-- 10. Keyboard (Parent: Peripherals)
-- ==========================================
('Keychron Q1 Max', 'Premium 75% mechanical keyboard with wireless.', 11500, 20, 'Keyboard', 'Peripherals', '{"type": "Keyboard", "layout": "75%", "switches": "Gateron Jupiter"}', 'https://picsum.photos/seed/kb1/600/600', true, false, 'Premium'),
('Wooting 60HE+', 'The fastest 60% keyboard with Hall Effect switches.', 14500, 10, 'Keyboard', 'Peripherals', '{"type": "Keyboard", "layout": "60%", "switches": "Lekker"}', 'https://picsum.photos/seed/kb2/600/600', true, false, 'Competitive'),
('Razer BlackWidow V4 Pro', 'Feature-rich full-size gaming keyboard.', 12500, 15, 'Keyboard', 'Peripherals', '{"type": "Keyboard", "layout": "100%", "switches": "Razer Green/Yellow"}', 'https://picsum.photos/seed/kb3/600/600', false, true, 'Sale'),
('Logitech G915 TKL', 'Low-profile wireless gaming keyboard.', 10500, 25, 'Keyboard', 'Peripherals', '{"type": "Keyboard", "layout": "TKL", "wireless": true}', 'https://picsum.photos/seed/kb4/600/600', false, false, 'Low Profile'),
('Corsair K70 CORE', 'Solid performance and great typing feel.', 5800, 40, 'Keyboard', 'Peripherals', '{"type": "Keyboard", "layout": "100%"}', 'https://picsum.photos/seed/kb5/600/600', true, false, 'Solid Choice'),
('SteelSeries Apex Pro TKL (2023)', 'Adjustable actuation switches.', 13500, 12, 'Keyboard', 'Peripherals', '{"type": "Keyboard", "switches": "OmniPoint"}', 'https://picsum.photos/seed/kb6/600/600', false, false, 'Adjustable'),
('Akko 3068B Plus', 'Great value wireless 65% keyboard.', 4200, 50, 'Keyboard', 'Peripherals', '{"type": "Keyboard", "layout": "65%"}', 'https://picsum.photos/seed/kb7/600/600', false, true, 'Budget Value'),
('Royal Kludge RK61', 'The classic budget 60% keyboard.', 2200, 100, 'Keyboard', 'Peripherals', '{"type": "Keyboard", "layout": "60%"}', 'https://picsum.photos/seed/kb8/600/600', false, false, 'Budget King'),
('Ducky One 3 TKL', 'Premium build quality and hot-swappable.', 7500, 20, 'Keyboard', 'Peripherals', '{"type": "Keyboard", "layout": "TKL"}', 'https://picsum.photos/seed/kb9/600/600', false, false, 'Enthusiast'),
('ASUS ROG Azoth', '75% wireless custom keyboard feel.', 15500, 8, 'Keyboard', 'Peripherals', '{"type": "Keyboard", "layout": "75%", "screen": "OLED"}', 'https://picsum.photos/seed/kb10/600/600', false, false, 'Top Tier'),

-- ==========================================
-- 11. Mouse (Parent: Peripherals)
-- ==========================================
('Logitech G Pro X Superlight 2', 'The world''s most popular wireless gaming mouse.', 8500, 50, 'Mouse', 'Peripherals', '{"type": "Mouse", "wireless": true, "weight": "60g"}', 'https://picsum.photos/seed/mouse1/600/600', false, false, 'Pro Choice'),
('Razer DeathAdder V3 Pro', 'Ergonomic wireless gaming excellence.', 7800, 40, 'Mouse', 'Peripherals', '{"type": "Mouse", "wireless": true, "weight": "63g"}', 'https://picsum.photos/seed/mouse2/600/600', false, true, 'Sale'),
('Finalmouse UltralightX', 'Incredibly light carbon fiber mouse.', 14500, 5, 'Mouse', 'Peripherals', '{"type": "Mouse", "weight": "29g"}', 'https://picsum.photos/seed/mouse3/600/600', true, false, 'Ultra Light'),
('Logitech G502 X Plus', 'The legendary mouse updated with wireless and RGB.', 9200, 30, 'Mouse', 'Peripherals', '{"type": "Mouse", "wireless": true, "buttons": 13}', 'https://picsum.photos/seed/mouse4/600/600', false, false, 'Versatile'),
('SteelSeries Aerox 3 Wireless', 'Ultra-lightweight with water resistance.', 4500, 60, 'Mouse', 'Peripherals', '{"type": "Mouse", "weight": "68g"}', 'https://picsum.photos/seed/mouse5/600/600', false, true, 'Value'),
('ZOWIE EC2-CW', 'Professional esports ergonomic wireless mouse.', 8800, 20, 'Mouse', 'Peripherals', '{"type": "Mouse", "wireless": true}', 'https://picsum.photos/seed/mouse6/600/600', true, false, 'Esports Pro'),
('Glorious Model O 2 Wireless', 'Ultra-lightweight honeycomb design.', 4800, 45, 'Mouse', 'Peripherals', '{"type": "Mouse", "wireless": true}', 'https://picsum.photos/seed/mouse7/600/600', false, false, 'Lightweight'),
('Razer Viper V3 Pro', 'Symmetrical wireless performance.', 8200, 35, 'Mouse', 'Peripherals', '{"type": "Mouse", "wireless": true}', 'https://picsum.photos/seed/mouse8/600/600', true, false, 'New'),
('Pulsar X2V2', 'High performance symmetrical wireless.', 5200, 40, 'Mouse', 'Peripherals', '{"type": "Mouse", "wireless": true}', 'https://picsum.photos/seed/mouse9/600/600', true, false, 'Enthusiast'),
('VGN Dragonfly F1 Pro', 'Incredible budget wireless mouse.', 2800, 100, 'Mouse', 'Peripherals', '{"type": "Mouse", "wireless": true, "weight": "49g"}', 'https://picsum.photos/seed/mouse10/600/600', false, true, 'Budget Beast'),

-- ==========================================
-- 12. Headset (Parent: Peripherals)
-- ==========================================
('SteelSeries Arctis Nova Pro Wireless', 'Ultimate gaming headset with ANC.', 18500, 15, 'Headset', 'Peripherals', '{"type": "Headset", "wireless": true, "anc": true}', 'https://picsum.photos/seed/hs1/600/600', false, false, 'Top Tier'),
('HyperX Cloud III Wireless', 'Legendary comfort and long battery life.', 8200, 40, 'Headset', 'Peripherals', '{"type": "Headset", "wireless": true}', 'https://picsum.photos/seed/hs2/600/600', false, false, 'Comfort'),
('Razer BlackShark V2 Pro (2023)', 'Best mic on a wireless gaming headset.', 9800, 30, 'Headset', 'Peripherals', '{"type": "Headset", "wireless": true}', 'https://picsum.photos/seed/hs3/600/600', false, true, 'Clear Mic'),
('Logitech G Pro X 2 Lightspeed', 'Graphene drivers for incredible audio.', 12500, 20, 'Headset', 'Peripherals', '{"type": "Headset", "wireless": true}', 'https://picsum.photos/seed/hs4/600/600', true, false, 'Pro Audio'),
('Corsair HS80 RGB Wireless', 'Great spatial audio and comfort.', 7200, 35, 'Headset', 'Peripherals', '{"type": "Headset", "wireless": true}', 'https://picsum.photos/seed/hs5/600/600', false, false, 'Spatial'),
('Sennheiser PC38X', 'The best sounding open-back gaming headset.', 9500, 10, 'Headset', 'Peripherals', '{"type": "Headset", "wired": true, "open_back": true}', 'https://picsum.photos/seed/hs6/600/600', false, false, 'Audiophile'),
('Beyerdynamic MMX 300 (2nd Gen)', 'Studio quality audio for gaming.', 14500, 5, 'Headset', 'Peripherals', '{"type": "Headset", "wired": true}', 'https://picsum.photos/seed/hs7/600/600', false, false, 'Studio'),
('SteelSeries Arctis Nova 7 Wireless', 'Versatile and comfortable mid-range.', 9200, 25, 'Headset', 'Peripherals', '{"type": "Headset", "wireless": true}', 'https://picsum.photos/seed/hs8/600/600', false, true, 'Sale'),
('Razer Barracuda X (2022)', 'Lightweight multi-platform wireless.', 4800, 50, 'Headset', 'Peripherals', '{"type": "Headset", "wireless": true}', 'https://picsum.photos/seed/hs9/600/600', false, false, 'Multi-Platform'),
('HyperX Cloud Stinger 2', 'Best budget wired headset.', 2200, 100, 'Headset', 'Peripherals', '{"type": "Headset", "wired": true}', 'https://picsum.photos/seed/hs10/600/600', false, false, 'Budget'),

-- ==========================================
-- 13. Power Supply (Parent: Networking & Power)
-- ==========================================
('Corsair RM850e ATX 3.1', '850W 80+ Gold Fully Modular.', 8200, 40, 'Power Supply', 'Networking & Power', '{"wattage": 850, "efficiency": "80+ Gold", "modular": "Full"}', 'https://picsum.photos/seed/ps1/600/600', true, false, 'Popular'),
('Seasonic Focus GX-750', 'Reliable 750W Gold power.', 6800, 50, 'Power Supply', 'Networking & Power', '{"wattage": 750, "efficiency": "80+ Gold"}', 'https://picsum.photos/seed/ps2/600/600', false, true, 'Reliable'),
('MSI MAG A850GL PCIE5', 'ATX 3.0 ready 850W Gold.', 7500, 35, 'Power Supply', 'Networking & Power', '{"wattage": 850, "efficiency": "80+ Gold"}', 'https://picsum.photos/seed/ps3/600/600', false, false, 'Modern'),
('Cooler Master MWE Gold 850 V2', 'Solid 850W Gold value.', 5800, 60, 'Power Supply', 'Networking & Power', '{"wattage": 850, "efficiency": "80+ Gold"}', 'https://picsum.photos/seed/ps4/600/600', false, false, 'Value'),
('FSP Hydro G Pro 850W', 'Robust 850W Gold.', 7200, 30, 'Power Supply', 'Networking & Power', '{"wattage": 850, "efficiency": "80+ Gold"}', 'https://picsum.photos/seed/ps5/600/600', false, false, 'Durable'),
('Corsair SF1000L', '1000W SFX-L Gold power.', 12500, 15, 'Power Supply', 'Networking & Power', '{"wattage": 1000, "efficiency": "80+ Gold", "form": "SFX-L"}', 'https://picsum.photos/seed/ps6/600/600', true, false, 'SFF Power'),
('DeepCool PX1000G', '1000W ATX 3.0 Gold.', 9500, 25, 'Power Supply', 'Networking & Power', '{"wattage": 1000, "efficiency": "80+ Gold"}', 'https://picsum.photos/seed/ps7/600/600', true, false, 'High Wattage'),
('SilverStone ST1200-PTS', '1200W Platinum in a compact chassis.', 18500, 10, 'Power Supply', 'Networking & Power', '{"wattage": 1200, "efficiency": "80+ Platinum"}', 'https://picsum.photos/seed/ps8/600/600', false, false, 'Platinum'),
('EVGA SuperNOVA 850 G7', 'Ultra-compact 850W Gold.', 8800, 20, 'Power Supply', 'Networking & Power', '{"wattage": 850, "efficiency": "80+ Gold"}', 'https://picsum.photos/seed/ps9/600/600', false, false, 'Compact'),
('Thermaltake Toughpower GF3 850W', 'ATX 3.0 ready with great performance.', 7800, 30, 'Power Supply', 'Networking & Power', '{"wattage": 850, "efficiency": "80+ Gold"}', 'https://picsum.photos/seed/ps10/600/600', false, true, 'Sale'),

-- ==========================================
-- 14. Networking (Parent: Networking & Power)
-- ==========================================
('ASUS ROG Rapture GT-BE98', 'World''s first quad-band WiFi 7 gaming router.', 45000, 5, 'Networking', 'Networking & Power', '{"type": "Router", "standard": "WiFi 7", "speed": "25Gbps"}', 'https://picsum.photos/seed/net1/600/600', true, false, 'Next Gen'),
('TP-Link Archer BE800', 'High-performance WiFi 7 router.', 32000, 10, 'Networking', 'Networking & Power', '{"type": "Router", "standard": "WiFi 7"}', 'https://picsum.photos/seed/net2/600/600', true, false, 'WiFi 7'),
('ASUS RT-AX88U Pro', 'Powerful WiFi 6E router for gaming.', 18500, 20, 'Networking', 'Networking & Power', '{"type": "Router", "standard": "WiFi 6E"}', 'https://picsum.photos/seed/net3/600/600', false, true, 'Sale'),
('TP-Link Deco XE75 (3-Pack)', 'Whole home mesh WiFi 6E system.', 24500, 15, 'Networking', 'Networking & Power', '{"type": "Mesh", "standard": "WiFi 6E", "quantity": 3}', 'https://picsum.photos/seed/net4/600/600', false, false, 'Mesh King'),
('Ubiquiti UniFi Dream Machine Special Edition', 'Enterprise-grade networking for home.', 35000, 8, 'Networking', 'Networking & Power', '{"type": "Gateway", "ports": "10Gbps SFP+"}', 'https://picsum.photos/seed/net5/600/600', false, false, 'Enterprise'),
('Netgear Nighthawk RS700S', 'Sleek and powerful WiFi 7 router.', 38000, 5, 'Networking', 'Networking & Power', '{"type": "Router", "standard": "WiFi 7"}', 'https://picsum.photos/seed/net6/600/600', true, false, 'Premium'),
('TP-Link Archer AX55', 'Great value WiFi 6 router.', 4800, 60, 'Networking', 'Networking & Power', '{"type": "Router", "standard": "WiFi 6"}', 'https://picsum.photos/seed/net7/600/600', false, true, 'Best Value'),
('ASUS PCE-AXE59BT', 'WiFi 6E PCIe card for desktop.', 3500, 40, 'Networking', 'Networking & Power', '{"type": "PCIe Card", "standard": "WiFi 6E"}', 'https://picsum.photos/seed/net8/600/600', false, false, 'Desktop WiFi'),
('QNAP QSW-M2108-2C', 'Managed 10GbE switch for fast local storage.', 14500, 12, 'Networking', 'Networking & Power', '{"type": "Switch", "speed": "10Gbps"}', 'https://picsum.photos/seed/net9/600/600', false, false, 'Fast Switch'),
('TP-Link LS1005G', 'Simple 5-port Gigabit switch.', 850, 150, 'Networking', 'Networking & Power', '{"type": "Switch", "speed": "1Gbps"}', 'https://picsum.photos/seed/net10/600/600', false, false, 'Basic Switch'),

-- ==========================================
-- 15. Cables & Hubs (Parent: Cables & Hubs)
-- ==========================================
('Anker 7-in-1 USB-C Hub', 'Versatile hub with HDMI, SD, and Power Delivery.', 2800, 100, 'Cables & Hubs', 'Cables & Hubs', '{"type": "Hub", "ports": 7}', 'https://picsum.photos/seed/ch1/600/600', false, true, 'Essential'),
('Satechi USB4 Multiport Adapter', 'High-speed USB4 hub with 8K HDMI.', 6500, 30, 'Cables & Hubs', 'Cables & Hubs', '{"type": "Hub", "standard": "USB4"}', 'https://picsum.photos/seed/ch2/600/600', true, false, 'High Speed'),
('Ugreen Revodok Pro 210', '10-in-1 docking station for laptops.', 4200, 50, 'Cables & Hubs', 'Cables & Hubs', '{"type": "Dock", "ports": 10}', 'https://picsum.photos/seed/ch3/600/600', false, false, 'Docking'),
('Belkin Thunderbolt 4 Cable (2m)', 'Certified high-speed data and power cable.', 3500, 40, 'Cables & Hubs', 'Cables & Hubs', '{"type": "Cable", "standard": "TB4"}', 'https://picsum.photos/seed/ch4/600/600', false, false, 'Certified'),
('Baseus 100W USB-C to USB-C Cable', 'Durable braided cable for fast charging.', 650, 200, 'Cables & Hubs', 'Cables & Hubs', '{"type": "Cable", "power": "100W"}', 'https://picsum.photos/seed/ch5/600/600', false, false, 'Durable'),
('CalDigit TS4 Thunderbolt 4 Dock', 'The ultimate docking station for pros.', 24500, 10, 'Cables & Hubs', 'Cables & Hubs', '{"type": "Dock", "standard": "TB4", "ports": 18}', 'https://picsum.photos/seed/ch6/600/600', false, false, 'Pro Dock'),
('Ugreen HDMI 2.1 Cable (3m)', '8K 60Hz / 4K 120Hz certified cable.', 850, 150, 'Cables & Hubs', 'Cables & Hubs', '{"type": "Cable", "standard": "HDMI 2.1"}', 'https://picsum.photos/seed/ch7/600/600', false, false, '8K Ready'),
('Anker 541 USB-C to Lightning Cable', 'Bio-based durable cable.', 950, 120, 'Cables & Hubs', 'Cables & Hubs', '{"type": "Cable"}', 'https://picsum.photos/seed/ch8/600/600', false, false, 'Eco Friendly'),
('Satechi Thunderbolt 4 Slim Hub', 'Compact and powerful TB4 hub.', 9800, 15, 'Cables & Hubs', 'Cables & Hubs', '{"type": "Hub", "standard": "TB4"}', 'https://picsum.photos/seed/ch9/600/600', true, false, 'Slim'),
('Cable Matters USB-C to DisplayPort 1.4', 'Connect your laptop to a high-end monitor.', 1200, 80, 'Cables & Hubs', 'Cables & Hubs', '{"type": "Cable"}', 'https://picsum.photos/seed/ch10/600/600', false, false, 'Display'),

-- ==========================================
-- 16. Furniture & Extras (Parent: Furniture & Extras)
-- ==========================================
('Secretlab TITAN Evo (2026)', 'The gold standard of gaming chairs.', 28500, 20, 'Furniture & Extras', 'Furniture & Extras', '{"type": "Chair", "material": "Hybrid Leatherette"}', 'https://picsum.photos/seed/fe1/600/600', true, false, 'Top Rated'),
('Herman Miller Embody Gaming Chair', 'The ultimate ergonomic gaming chair.', 95000, 5, 'Furniture & Extras', 'Furniture & Extras', '{"type": "Chair", "ergonomics": "Extreme"}', 'https://picsum.photos/seed/fe2/600/600', false, false, 'End Game'),
('Omnidesk Ascent Wildwood', 'Premium standing desk with solid wood top.', 42000, 10, 'Furniture & Extras', 'Furniture & Extras', '{"type": "Desk", "motor": "Dual", "top": "Solid Wood"}', 'https://picsum.photos/seed/fe3/600/600', true, false, 'Premium Desk'),
('Elgato Stream Deck MK.2', 'Essential tool for streamers and productivity.', 8500, 30, 'Furniture & Extras', 'Furniture & Extras', '{"type": "Controller", "keys": 15}', 'https://picsum.photos/seed/fe4/600/600', false, true, 'Streamer Choice'),
('Philips Hue Play Gradient Lightstrip', 'Immersive lighting for your setup.', 9500, 25, 'Furniture & Extras', 'Furniture & Extras', '{"type": "Lighting", "smart": true}', 'https://picsum.photos/seed/fe5/600/600', false, false, 'Immersive'),
('BenQ ScreenBar Halo', 'Premium monitor light bar with wireless controller.', 8800, 15, 'Furniture & Extras', 'Furniture & Extras', '{"type": "Lighting", "mount": "Monitor"}', 'https://picsum.photos/seed/fe6/600/600', true, false, 'Eye Care'),
('Grovemade Walnut Desk Shelf', 'Elevate your setup with premium materials.', 12500, 8, 'Furniture & Extras', 'Furniture & Extras', '{"type": "Shelf", "material": "Walnut"}', 'https://picsum.photos/seed/fe7/600/600', false, false, 'Aesthetic'),
('Razer Base Station V2 Chroma', 'Stylish headset stand with USB hub.', 4200, 40, 'Furniture & Extras', 'Furniture & Extras', '{"type": "Stand", "rgb": true}', 'https://picsum.photos/seed/fe8/600/600', false, false, 'Stylish'),
('SteelSeries QcK Heavy XXL', 'Massive high-quality mousepad.', 1800, 100, 'Furniture & Extras', 'Furniture & Extras', '{"type": "Mousepad", "size": "XXL"}', 'https://picsum.photos/seed/fe9/600/600', false, false, 'Pro Surface'),
('Nanoleaf Shapes Triangles (9-Pack)', 'Modular smart lighting for your wall.', 11500, 15, 'Furniture & Extras', 'Furniture & Extras', '{"type": "Lighting", "quantity": 9}', 'https://picsum.photos/seed/fe10/600/600', false, true, 'Wall Art');
