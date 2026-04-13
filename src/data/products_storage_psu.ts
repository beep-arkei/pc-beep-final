import { Product } from '../types';

export const STORAGE_PRODUCTS: Partial<Product>[] = [
  // NVMe SSDs (20 items)
  {
    name: 'Samsung 990 Pro 2TB with Heatsink',
    description: 'The fastest Gen4 NVMe SSD for gaming and productivity.',
    price: 12500,
    stock_quantity: 20,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'NVMe Gen4', read_speed: '7450MB/s', write_speed: '6900MB/s' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Samsung 980 Pro 1TB',
    description: 'Reliable and fast Gen4 performance.',
    price: 6800,
    stock_quantity: 30,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'NVMe Gen4', read_speed: '7000MB/s', write_speed: '5000MB/s' },
    image_url: ''
  },
  {
    name: 'WD Black SN850X 2TB',
    description: 'Top-tier Gen4 SSD optimized for gaming.',
    price: 11500,
    stock_quantity: 15,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'NVMe Gen4', read_speed: '7300MB/s', write_speed: '6600MB/s' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Crucial T700 1TB Gen5 NVMe',
    description: 'Blazing fast Gen5 speeds for extreme performance.',
    price: 14500,
    stock_quantity: 10,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'NVMe Gen5', read_speed: '11700MB/s', write_speed: '9500MB/s' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Crucial P5 Plus 1TB',
    description: 'Great value Gen4 SSD with solid performance.',
    price: 5500,
    stock_quantity: 40,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'NVMe Gen4', read_speed: '6600MB/s', write_speed: '5000MB/s' },
    image_url: ''
  },
  {
    name: 'Kingston KC3000 2TB',
    description: 'High-performance Gen4 SSD with excellent endurance.',
    price: 9800,
    stock_quantity: 25,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'NVMe Gen4', read_speed: '7000MB/s', write_speed: '7000MB/s' },
    image_url: ''
  },
  {
    name: 'Kingston NV2 1TB',
    description: 'The best budget Gen4 NVMe SSD.',
    price: 3200,
    stock_quantity: 100,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'NVMe Gen4', read_speed: '3500MB/s', write_speed: '2100MB/s' },
    image_url: ''
  },
  {
    name: 'TeamGroup MP33 512GB',
    description: 'Reliable budget Gen3 NVMe SSD.',
    price: 1800,
    stock_quantity: 80,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '512GB', interface: 'NVMe Gen3', read_speed: '1800MB/s', write_speed: '1500MB/s' },
    image_url: ''
  },
  {
    name: 'ADATA XPG SX8200 Pro 1TB',
    description: 'Classic high-performance Gen3 SSD.',
    price: 3800,
    stock_quantity: 50,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'NVMe Gen3', read_speed: '3500MB/s', write_speed: '3000MB/s' },
    image_url: ''
  },
  {
    name: 'Sabrent Rocket 4 Plus 4TB',
    description: 'Massive capacity with high-end Gen4 speeds.',
    price: 28500,
    stock_quantity: 5,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '4TB', interface: 'NVMe Gen4', read_speed: '7000MB/s', write_speed: '6850MB/s' },
    image_url: ''
  },
  {
    name: 'Seagate FireCuda 530 2TB',
    description: 'Extreme endurance and speed for PS5 and PC.',
    price: 13500,
    stock_quantity: 12,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'NVMe Gen4', read_speed: '7300MB/s', write_speed: '6900MB/s' },
    image_url: ''
  },
  {
    name: 'Corsair MP600 Pro LPX 1TB',
    description: 'Optimized Gen4 SSD for PS5.',
    price: 6500,
    stock_quantity: 20,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'NVMe Gen4', read_speed: '7100MB/s', write_speed: '5800MB/s' },
    image_url: ''
  },
  {
    name: 'Lexar NM790 2TB',
    description: 'Excellent performance at a competitive price.',
    price: 8500,
    stock_quantity: 30,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'NVMe Gen4', read_speed: '7400MB/s', write_speed: '6500MB/s' },
    image_url: ''
  },
  {
    name: 'PNY CS2140 1TB',
    description: 'Entry-level Gen4 SSD.',
    price: 3500,
    stock_quantity: 45,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'NVMe Gen4', read_speed: '3600MB/s', write_speed: '3200MB/s' },
    image_url: ''
  },
  {
    name: 'Silicon Power A60 1TB',
    description: 'Budget Gen3 NVMe SSD.',
    price: 2800,
    stock_quantity: 60,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'NVMe Gen3', read_speed: '2200MB/s', write_speed: '1600MB/s' },
    image_url: ''
  },
  {
    name: 'MSI Spatium M480 Pro 2TB',
    description: 'High-end Gen4 SSD with premium cooling.',
    price: 10500,
    stock_quantity: 15,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'NVMe Gen4', read_speed: '7400MB/s', write_speed: '7000MB/s' },
    image_url: ''
  },
  {
    name: 'Gigabyte AORUS Gen4 7300 1TB',
    description: 'Fast Gen4 performance with stylish heatsink.',
    price: 6200,
    stock_quantity: 20,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'NVMe Gen4', read_speed: '7300MB/s', write_speed: '6000MB/s' },
    image_url: ''
  },
  {
    name: 'Patriot Viper VP4300 2TB',
    description: 'Dual heatsink design for extreme Gen4 speeds.',
    price: 11800,
    stock_quantity: 10,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'NVMe Gen4', read_speed: '7400MB/s', write_speed: '6800MB/s' },
    image_url: ''
  },
  {
    name: 'Mushkin Vortex 2TB',
    description: 'Solid Gen4 performance and value.',
    price: 8200,
    stock_quantity: 18,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'NVMe Gen4', read_speed: '7410MB/s', write_speed: '6800MB/s' },
    image_url: ''
  },
  {
    name: 'Inland Performance Plus 2TB',
    description: 'High-end Gen4 SSD with great value.',
    price: 9500,
    stock_quantity: 20,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'NVMe Gen4', read_speed: '7000MB/s', write_speed: '6850MB/s' },
    image_url: ''
  },

  // SATA SSDs & HDDs (20 items)
  {
    name: 'Samsung 870 EVO 1TB SATA SSD',
    description: 'The most reliable SATA SSD for everyday use.',
    price: 4800,
    stock_quantity: 50,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'SATA III', read_speed: '560MB/s', write_speed: '530MB/s' },
    image_url: ''
  },
  {
    name: 'Crucial MX500 2TB SATA SSD',
    description: 'Excellent value and performance SATA SSD.',
    price: 8500,
    stock_quantity: 30,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'SATA III', read_speed: '560MB/s', write_speed: '510MB/s' },
    image_url: ''
  },
  {
    name: 'Kingston A400 480GB SATA SSD',
    description: 'Ultra-budget SATA SSD for reviving old PCs.',
    price: 1600,
    stock_quantity: 100,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '480GB', interface: 'SATA III', read_speed: '500MB/s', write_speed: '450MB/s' },
    image_url: ''
  },
  {
    name: 'Seagate Barracuda 2TB HDD',
    description: 'Reliable mass storage for files and games.',
    price: 3200,
    stock_quantity: 150,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'SATA III', rpm: '7200', cache: '256MB' },
    image_url: ''
  },
  {
    name: 'WD Blue 4TB HDD',
    description: 'High-capacity storage for media and backups.',
    price: 5800,
    stock_quantity: 80,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '4TB', interface: 'SATA III', rpm: '5400', cache: '256MB' },
    image_url: ''
  },
  {
    name: 'WD Black 2TB HDD',
    description: 'Performance HDD for gaming and heavy workloads.',
    price: 6500,
    stock_quantity: 40,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'SATA III', rpm: '7200', cache: '64MB' },
    image_url: ''
  },
  {
    name: 'Seagate IronWolf 8TB NAS HDD',
    description: 'Optimized for NAS systems with high reliability.',
    price: 12500,
    stock_quantity: 20,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '8TB', interface: 'SATA III', rpm: '7200', cache: '256MB' },
    image_url: ''
  },
  {
    name: 'WD Red Plus 4TB NAS HDD',
    description: 'Reliable storage for home and small business NAS.',
    price: 7200,
    stock_quantity: 30,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '4TB', interface: 'SATA III', rpm: '5400', cache: '128MB' },
    image_url: ''
  },
  {
    name: 'Samsung 870 QVO 4TB SATA SSD',
    description: 'Massive SATA SSD storage for media libraries.',
    price: 18500,
    stock_quantity: 10,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '4TB', interface: 'SATA III', read_speed: '560MB/s', write_speed: '530MB/s' },
    image_url: ''
  },
  {
    name: 'TeamGroup GX2 1TB SATA SSD',
    description: 'Budget-friendly 1TB SATA SSD.',
    price: 3200,
    stock_quantity: 60,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'SATA III', read_speed: '530MB/s', write_speed: '480MB/s' },
    image_url: ''
  },
  {
    name: 'SanDisk SSD Plus 1TB SATA SSD',
    description: 'Reliable and affordable SATA SSD.',
    price: 3500,
    stock_quantity: 50,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'SATA III', read_speed: '535MB/s', write_speed: '450MB/s' },
    image_url: ''
  },
  {
    name: 'Toshiba P300 1TB HDD',
    description: 'Solid entry-level HDD for basic storage.',
    price: 2400,
    stock_quantity: 100,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'SATA III', rpm: '7200', cache: '64MB' },
    image_url: ''
  },
  {
    name: 'Seagate Exos X18 18TB HDD',
    description: 'Enterprise-grade mass storage for data centers.',
    price: 24500,
    stock_quantity: 5,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '18TB', interface: 'SATA III', rpm: '7200', cache: '256MB' },
    image_url: ''
  },
  {
    name: 'WD Gold 10TB Enterprise HDD',
    description: 'Highly reliable storage for enterprise applications.',
    price: 18500,
    stock_quantity: 8,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '10TB', interface: 'SATA III', rpm: '7200', cache: '256MB' },
    image_url: ''
  },
  {
    name: 'PNY CS900 2TB SATA SSD',
    description: 'Large capacity budget SATA SSD.',
    price: 7200,
    stock_quantity: 25,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '2TB', interface: 'SATA III', read_speed: '550MB/s', write_speed: '530MB/s' },
    image_url: ''
  },
  {
    name: 'Silicon Power A55 512GB SATA SSD',
    description: 'Reliable budget SATA SSD.',
    price: 1800,
    stock_quantity: 70,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '512GB', interface: 'SATA III', read_speed: '560MB/s', write_speed: '530MB/s' },
    image_url: ''
  },
  {
    name: 'ADATA Ultimate SU800 1TB SATA SSD',
    description: 'High-performance SATA SSD with 3D NAND.',
    price: 4200,
    stock_quantity: 35,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '1TB', interface: 'SATA III', read_speed: '560MB/s', write_speed: '520MB/s' },
    image_url: ''
  },
  {
    name: 'Patriot Burst Elite 960GB SATA SSD',
    description: 'Value-oriented SATA SSD.',
    price: 2900,
    stock_quantity: 50,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '960GB', interface: 'SATA III', read_speed: '450MB/s', write_speed: '320MB/s' },
    image_url: ''
  },
  {
    name: 'Mushkin Source II 500GB SATA SSD',
    description: 'Reliable and affordable SATA SSD.',
    price: 1700,
    stock_quantity: 60,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '500GB', interface: 'SATA III', read_speed: '560MB/s', write_speed: '515MB/s' },
    image_url: ''
  },
  {
    name: 'Lexar NS100 256GB SATA SSD',
    description: 'Ultra-budget boot drive.',
    price: 950,
    stock_quantity: 100,
    category: 'Storage',
    parent_category: 'Core Components',
    specs: { capacity: '256GB', interface: 'SATA III', read_speed: '520MB/s', write_speed: '450MB/s' },
    image_url: ''
  },

];

export const PSU_PRODUCTS: Partial<Product>[] = [
  // High-End PSUs (20 items)
  {
    name: 'Corsair RM850x (2021) 850W 80+ Gold',
    description: 'The gold standard for reliable and quiet power.',
    price: 8500,
    stock_quantity: 25,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '850W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Seasonic Focus GX-750 750W 80+ Gold',
    description: 'Compact and highly reliable power supply.',
    price: 6800,
    stock_quantity: 30,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '750W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'EVGA SuperNOVA 1000 G7 1000W 80+ Gold',
    description: 'High wattage for extreme builds.',
    price: 12500,
    stock_quantity: 10,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1000W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Corsair SF750 750W 80+ Platinum',
    description: 'The best SFX power supply on the market.',
    price: 10500,
    stock_quantity: 15,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '750W', efficiency: '80+ Platinum', modular: 'Full', form_factor: 'SFX' },
    image_url: ''
  },
  {
    name: 'ASUS ROG Thor 1200W Platinum II',
    description: 'Premium power with OLED display and RGB.',
    price: 18500,
    stock_quantity: 5,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1200W', efficiency: '80+ Platinum', modular: 'Full', form_factor: 'ATX' },
    image_url: '',
    is_new: true
  },
  {
    name: 'MSI MPG A850G PCIE5 850W 80+ Gold',
    description: 'ATX 3.0 ready with native 12VHPWR connector.',
    price: 9200,
    stock_quantity: 20,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '850W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Thermaltake Toughpower GF3 1000W 80+ Gold',
    description: 'Reliable ATX 3.0 power for modern GPUs.',
    price: 11500,
    stock_quantity: 12,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1000W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Be Quiet! Dark Power 13 1000W 80+ Titanium',
    description: 'Ultra-efficient and virtually inaudible.',
    price: 16500,
    stock_quantity: 5,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1000W', efficiency: '80+ Titanium', modular: 'Full', form_factor: 'ATX' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Cooler Master V850 SFX Gold',
    description: 'Powerful SFX PSU for compact builds.',
    price: 8800,
    stock_quantity: 15,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '850W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'SFX' },
    image_url: ''
  },
  {
    name: 'SilverStone SX1000 Platinum',
    description: 'Incredible power density in SFX-L form factor.',
    price: 14500,
    stock_quantity: 8,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1000W', efficiency: '80+ Platinum', modular: 'Full', form_factor: 'SFX-L' },
    image_url: ''
  },
  {
    name: 'Corsair HX1200 1200W 80+ Platinum',
    description: 'High-performance Platinum efficiency.',
    price: 15500,
    stock_quantity: 10,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1200W', efficiency: '80+ Platinum', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Seasonic Prime TX-1000 1000W 80+ Titanium',
    description: 'The pinnacle of power supply engineering.',
    price: 22500,
    stock_quantity: 3,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1000W', efficiency: '80+ Titanium', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'EVGA SuperNOVA 850 P6 850W 80+ Platinum',
    description: 'Compact and efficient Platinum power.',
    price: 9800,
    stock_quantity: 15,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '850W', efficiency: '80+ Platinum', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Phanteks Revolt Pro 1000W 80+ Gold',
    description: 'Unique PSU that allows for dual-system setups.',
    price: 10800,
    stock_quantity: 10,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1000W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Fractal Design Ion+ 2 Platinum 860W',
    description: 'Ultra-flexible cables and Platinum efficiency.',
    price: 9500,
    stock_quantity: 12,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '860W', efficiency: '80+ Platinum', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Super Flower Leadex V Gold 1000W',
    description: 'Ultra-compact 1000W Gold PSU.',
    price: 11200,
    stock_quantity: 10,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1000W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'FSP Hydro PTM Pro 1200W 80+ Platinum',
    description: 'Industrial-grade power for high-end systems.',
    price: 14800,
    stock_quantity: 8,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1200W', efficiency: '80+ Platinum', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'NZXT C850 (2022) 850W 80+ Gold',
    description: 'Reliable and clean design for modern builds.',
    price: 7800,
    stock_quantity: 20,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '850W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Deepcool PQ1000M 1000W 80+ Gold',
    description: 'Solid performance with Seasonic-based internals.',
    price: 9500,
    stock_quantity: 15,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1000W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Antec Signature 1000W 80+ Titanium',
    description: 'Flagship Titanium power with extreme stability.',
    price: 19500,
    stock_quantity: 5,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '1000W', efficiency: '80+ Titanium', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },

  // Budget & Mainstream PSUs (20 items)
  {
    name: 'Corsair CV650 650W 80+ Bronze',
    description: 'Reliable budget power for entry-level builds.',
    price: 3200,
    stock_quantity: 50,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '650W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Cooler Master MWE Gold 750 V2',
    description: 'Great value Gold efficiency PSU.',
    price: 5200,
    stock_quantity: 40,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '750W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'EVGA 600 BR 600W 80+ Bronze',
    description: 'Solid budget option from EVGA.',
    price: 2800,
    stock_quantity: 60,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '600W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Seasonic S12III 550W 80+ Bronze',
    description: 'Classic reliability for budget systems.',
    price: 3100,
    stock_quantity: 45,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '550W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Thermaltake Smart BM2 750W 80+ Bronze',
    description: 'Semi-modular budget power.',
    price: 3800,
    stock_quantity: 35,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '750W', efficiency: '80+ Bronze', modular: 'Semi', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'MSI MAG A650BN 650W 80+ Bronze',
    description: 'Excellent value Bronze PSU.',
    price: 3000,
    stock_quantity: 55,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '650W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Gigabyte P750GM 750W 80+ Gold',
    description: 'Fully modular Gold PSU at a great price.',
    price: 4500,
    stock_quantity: 30,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '750W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Deepcool PK650D 650W 80+ Bronze',
    description: 'Reliable and affordable Bronze power.',
    price: 2800,
    stock_quantity: 60,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '650W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'SilverStone Strider Essential 500W 80+',
    description: 'Basic power for home and office PCs.',
    price: 2200,
    stock_quantity: 80,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '500W', efficiency: '80+', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'FSP HV PRO 650W 80+ White',
    description: 'Solid budget performance.',
    price: 2500,
    stock_quantity: 70,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '650W', efficiency: '80+', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Be Quiet! System Power 10 650W 80+ Bronze',
    description: 'Quiet and reliable budget power.',
    price: 3600,
    stock_quantity: 40,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '650W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Antec VP650P Plus 650W 80+',
    description: 'Reliable budget power from Antec.',
    price: 2900,
    stock_quantity: 50,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '650W', efficiency: '80+', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'AeroCool LUX RGB 650W 80+ Bronze',
    description: 'Stylish budget PSU with RGB.',
    price: 2700,
    stock_quantity: 45,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '650W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Cougar VTE600 600W 80+ Bronze',
    description: 'Solid performance for mainstream builds.',
    price: 2600,
    stock_quantity: 50,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '600W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Segotep GM750W 750W 80+ Gold',
    description: 'Affordable fully modular Gold PSU.',
    price: 4200,
    stock_quantity: 35,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '750W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'InWin A65 650W 80+ Bronze',
    description: 'Reliable and compact budget power.',
    price: 2850,
    stock_quantity: 40,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '650W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Zalman GigaMax 650W 80+ Bronze',
    description: 'Solid budget performance from Zalman.',
    price: 2750,
    stock_quantity: 45,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '650W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Rosewill ARC 650 650W 80+ Bronze',
    description: 'Value-oriented Bronze power.',
    price: 2650,
    stock_quantity: 50,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '650W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'BitFenix Formula Bronze 600W',
    description: 'High-quality Bronze efficiency PSU.',
    price: 3100,
    stock_quantity: 30,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '600W', efficiency: '80+ Bronze', modular: 'Non', form_factor: 'ATX' },
    image_url: ''
  },
  {
    name: 'Xigmatek Thor T750 750W 80+ Gold',
    description: 'Stylish and powerful Gold PSU.',
    price: 4800,
    stock_quantity: 20,
    category: 'Power Supply',
    parent_category: 'Core Components',
    specs: { wattage: '750W', efficiency: '80+ Gold', modular: 'Full', form_factor: 'ATX' },
    image_url: ''
  }
];
