-- Seed Data for PC Beep (Philippine Market)
-- 20 real-world computer components with realistic PHP pricing, accurate specs, and image galleries.

TRUNCATE TABLE products CASCADE;

INSERT INTO products (name, description, price, stock_quantity, category, parent_category, specs, image_url, gallery_urls, is_new, is_deal, promotion_label, discount_price)
VALUES 
-- CPUs
('AMD Ryzen 7 7800X3D', 'The ultimate gaming processor with 3D V-Cache technology.', 24500, 25, 'CPU', 'Core Components', '{"socket": "AM5", "cores": 8, "threads": 16, "wattage": 120}', 'https://picsum.photos/seed/ryzen7800x3d/800/800', ARRAY['https://picsum.photos/seed/ryzen7800x3d-1/800/800', 'https://picsum.photos/seed/ryzen7800x3d-2/800/800'], true, false, 'Best for Gaming', NULL),
('Intel Core i9-14900K', 'The fastest desktop processor for enthusiasts and creators.', 34500, 15, 'CPU', 'Core Components', '{"socket": "LGA1700", "cores": 24, "threads": 32, "wattage": 125}', 'https://picsum.photos/seed/i914900k/800/800', ARRAY['https://picsum.photos/seed/i914900k-1/800/800', 'https://picsum.photos/seed/i914900k-2/800/800'], true, false, 'Flagship', NULL),
('Intel Core i7-14700K', 'High-performance processor with 20 cores, perfect for high-end gaming.', 25800, 20, 'CPU', 'Core Components', '{"socket": "LGA1700", "cores": 20, "threads": 28, "wattage": 125}', 'https://picsum.photos/seed/i714700k/800/800', ARRAY['https://picsum.photos/seed/i714700k-1/800/800'], false, false, NULL, NULL),

-- GPUs
('NVIDIA GeForce RTX 4080 Super', 'High-performance graphics card for 4K gaming and creative work.', 68500, 10, 'GPU', 'Core Components', '{"chipset": "RTX 4080 Super", "vram": "16GB GDDR6X", "wattage": 320}', 'https://picsum.photos/seed/rtx4080super/800/800', ARRAY['https://picsum.photos/seed/rtx4080super-1/800/800', 'https://picsum.photos/seed/rtx4080super-2/800/800'], true, true, 'Hot Deal', 65000),
('NVIDIA GeForce RTX 4070 Super', 'The sweet spot for 1440p gaming with DLSS 3 support.', 38500, 20, 'GPU', 'Core Components', '{"chipset": "RTX 4070 Super", "vram": "12GB GDDR6X", "wattage": 220}', 'https://picsum.photos/seed/rtx4070super/800/800', ARRAY['https://picsum.photos/seed/rtx4070super-1/800/800'], true, true, 'Best Value', 36500),
('AMD Radeon RX 7900 XTX', 'AMD''s flagship graphics card with 24GB of memory.', 62000, 12, 'GPU', 'Core Components', '{"chipset": "RX 7900 XTX", "vram": "24GB GDDR6", "wattage": 355}', 'https://picsum.photos/seed/rx7900xtx/800/800', ARRAY['https://picsum.photos/seed/rx7900xtx-1/800/800'], false, false, 'AMD Flagship', NULL),

-- Motherboards
('ASUS ROG Strix B650-A Gaming WiFi', 'Premium AM5 motherboard with white aesthetics and WiFi 6E.', 14800, 15, 'Motherboard', 'Core Components', '{"socket": "AM5", "form_factor": "ATX", "chipset": "B650"}', 'https://picsum.photos/seed/rogstrixb650/800/800', ARRAY['https://picsum.photos/seed/rogstrixb650-1/800/800'], false, false, NULL, NULL),
('MSI MAG Z790 Tomahawk WiFi', 'Reliable and high-performance motherboard for Intel 14th Gen.', 16500, 20, 'Motherboard', 'Core Components', '{"socket": "LGA1700", "form_factor": "ATX", "chipset": "Z790"}', 'https://picsum.photos/seed/z790tomahawk/800/800', ARRAY['https://picsum.photos/seed/z790tomahawk-1/800/800'], false, false, NULL, NULL),

-- RAM
('Corsair Vengeance RGB 32GB DDR5-6000', 'High-speed DDR5 memory with vibrant RGB lighting.', 8200, 40, 'RAM', 'Core Components', '{"capacity": "32GB", "speed": "6000MHz", "type": "DDR5"}', 'https://picsum.photos/seed/corsairddr5/800/800', ARRAY['https://picsum.photos/seed/corsairddr5-1/800/800'], false, true, 'Sale', 7800),
('G.Skill Trident Z5 RGB 64GB DDR5-6400', 'Massive capacity and speed for heavy multitasking.', 15800, 10, 'RAM', 'Core Components', '{"capacity": "64GB", "speed": "6400MHz", "type": "DDR5"}', 'https://picsum.photos/seed/tridentz5/800/800', ARRAY['https://picsum.photos/seed/tridentz5-1/800/800'], true, false, 'High Capacity', NULL),

-- Storage
('Samsung 990 Pro 2TB NVMe SSD', 'Blazing fast PCIe 4.0 storage for quick load times.', 11500, 30, 'Storage', 'Core Components', '{"capacity": "2TB", "interface": "PCIe 4.0", "type": "NVMe"}', 'https://picsum.photos/seed/samsung990pro/800/800', ARRAY['https://picsum.photos/seed/samsung990pro-1/800/800'], true, false, 'Top Rated', NULL),
('WD Black SN850X 2TB', 'High-performance gaming SSD with optional heatsink.', 10200, 25, 'Storage', 'Core Components', '{"capacity": "2TB", "interface": "PCIe 4.0", "type": "NVMe"}', 'https://picsum.photos/seed/wdblacksn850x/800/800', ARRAY['https://picsum.photos/seed/wdblacksn850x-1/800/800'], false, false, 'Gamer Choice', NULL),

-- PSUs
('Corsair RM850e 850W Gold PSU', 'Fully modular, low-noise power supply with 80 Plus Gold efficiency.', 7200, 20, 'PSU', 'Core Components', '{"wattage": 850, "efficiency": "80+ Gold", "modular": "Full"}', 'https://picsum.photos/seed/corsairrm850e/800/800', ARRAY['https://picsum.photos/seed/corsairrm850e-1/800/800'], false, false, NULL, NULL),
('Seasonic Focus GX-1000 1000W', 'High-quality 1000W power supply for high-end builds.', 10500, 15, 'PSU', 'Core Components', '{"wattage": 1000, "efficiency": "80+ Gold", "modular": "Full"}', 'https://picsum.photos/seed/seasonicfocus/800/800', ARRAY['https://picsum.photos/seed/seasonicfocus-1/800/800'], false, false, NULL, NULL),

-- Cases
('Lian Li O11 Dynamic EVO (White)', 'Iconic dual-chamber chassis with modular design.', 9800, 12, 'Case', 'Core Components', '{"type": "Mid Tower", "color": "White", "side_panel": "Tempered Glass"}', 'https://picsum.photos/seed/lianlio11d/800/800', ARRAY['https://picsum.photos/seed/lianlio11d-1/800/800'], false, false, 'Popular', NULL),
('NZXT H9 Flow (Black)', 'Dual-chamber mid-tower case with massive glass panels.', 11200, 10, 'Case', 'Core Components', '{"type": "Mid Tower", "color": "Black", "side_panel": "Tempered Glass"}', 'https://picsum.photos/seed/nzxth9flow/800/800', ARRAY['https://picsum.photos/seed/nzxth9flow-1/800/800'], true, false, 'Aesthetic', NULL),

-- Coolers
('DeepCool LT720 360mm AIO', 'High-performance liquid cooler with multidimensional infinity mirror design.', 6800, 18, 'Cooler', 'Core Components', '{"type": "Liquid", "size": "360mm"}', 'https://picsum.photos/seed/deepcoollt720/800/800', ARRAY['https://picsum.photos/seed/deepcoollt720-1/800/800'], false, true, 'Promo', 6200),
('Noctua NH-D15', 'The legendary dual-tower air cooler for maximum cooling performance.', 5500, 15, 'Cooler', 'Core Components', '{"type": "Air", "fans": 2}', 'https://picsum.photos/seed/noctuanhd15/800/800', ARRAY['https://picsum.photos/seed/noctuanhd15-1/800/800'], false, false, 'Silent King', NULL),

-- Peripherals
('MCHOSE Jet 75', 'Premium 75% mechanical keyboard with KTT White switches.', 4200, 25, 'Peripherals', 'Peripherals', '{"type": "Keyboard", "layout": "75%", "switches": "KTT White"}', 'https://picsum.photos/seed/mchosejet75/800/800', ARRAY['https://picsum.photos/seed/mchosejet75-1/800/800'], true, false, 'New Arrival', NULL),
('Logitech G Pro X Superlight 2', 'The world''s most popular wireless gaming mouse.', 8500, 25, 'Peripherals', 'Peripherals', '{"type": "Mouse", "wireless": true, "weight": "60g"}', 'https://picsum.photos/seed/superlight2/800/800', ARRAY['https://picsum.photos/seed/superlight2-1/800/800'], true, false, 'Pro Choice', NULL);
