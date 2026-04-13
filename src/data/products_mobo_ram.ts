import { Product } from '../types';

export const MOTHERBOARD_PRODUCTS: Partial<Product>[] = [
  // Intel Motherboards (20 items)
  {
    name: 'ASUS ROG Maximus Z790 Dark Hero',
    description: 'The ultimate Z790 motherboard for Intel 14th Gen.',
    price: 45500,
    stock_quantity: 5,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z790', form_factor: 'ATX', memory: 'DDR5' },
    image_url: '',
    is_new: true
  },
  {
    name: 'MSI MEG Z790 GODLIKE',
    description: 'Extreme performance and features for enthusiasts.',
    price: 78500,
    stock_quantity: 2,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z790', form_factor: 'E-ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'ASUS ROG Strix Z790-E Gaming WiFi II',
    description: 'High-end features with modern aesthetics.',
    price: 32500,
    stock_quantity: 10,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z790', form_factor: 'ATX', memory: 'DDR5' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Gigabyte Z790 AORUS Master',
    description: 'Robust power delivery and cooling.',
    price: 34500,
    stock_quantity: 8,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z790', form_factor: 'E-ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'MSI MPG Z790 Carbon WiFi',
    description: 'Sleek black design with powerful features.',
    price: 28500,
    stock_quantity: 12,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z790', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'ASUS Prime Z790-A WiFi',
    description: 'Reliable and clean white design.',
    price: 19500,
    stock_quantity: 15,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z790', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'MSI MAG Z790 Tomahawk WiFi',
    description: 'The legendary Tomahawk reliability for Z790.',
    price: 16500,
    stock_quantity: 20,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z790', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'Gigabyte Z790 UD AC',
    description: 'Solid entry-level Z790 board.',
    price: 13500,
    stock_quantity: 25,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z790', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'ASUS ROG Strix B760-A Gaming WiFi D4',
    description: 'High-end B760 with DDR4 support.',
    price: 14500,
    stock_quantity: 15,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'B760', form_factor: 'ATX', memory: 'DDR4' },
    image_url: ''
  },
  {
    name: 'MSI MAG B760M Mortar WiFi',
    description: 'The best mATX B760 motherboard.',
    price: 11500,
    stock_quantity: 30,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'B760', form_factor: 'mATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'ASUS TUF Gaming B760-Plus WiFi',
    description: 'Durable and feature-rich B760.',
    price: 12500,
    stock_quantity: 25,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'B760', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'Gigabyte B760M DS3H AX',
    description: 'Budget-friendly B760 with WiFi.',
    price: 8500,
    stock_quantity: 40,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'B760', form_factor: 'mATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'ASRock B760M-HDV/M.2 D4',
    description: 'Ultra-budget B760 for basic builds.',
    price: 6500,
    stock_quantity: 35,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'B760', form_factor: 'mATX', memory: 'DDR4' },
    image_url: ''
  },
  {
    name: 'ASUS ROG Strix Z690-G Gaming WiFi',
    description: 'High-end mATX Z690.',
    price: 15500,
    stock_quantity: 5,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z690', form_factor: 'mATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'MSI PRO Z690-A WiFi D4',
    description: 'Solid Z690 with DDR4 support.',
    price: 12500,
    stock_quantity: 10,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z690', form_factor: 'ATX', memory: 'DDR4' },
    image_url: ''
  },
  {
    name: 'Gigabyte H610M S2H V2',
    description: 'Entry-level H610 for budget Intel builds.',
    price: 4800,
    stock_quantity: 50,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'H610', form_factor: 'mATX', memory: 'DDR4' },
    image_url: ''
  },
  {
    name: 'ASUS ROG Strix Z790-I Gaming WiFi',
    description: 'The ultimate ITX motherboard for Intel.',
    price: 28500,
    stock_quantity: 5,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z790', form_factor: 'ITX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'MSI MPG B760I Edge WiFi',
    description: 'Powerful ITX B760.',
    price: 15500,
    stock_quantity: 8,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'B760', form_factor: 'ITX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'ASUS Prime H770-Plus D4',
    description: 'Balanced H770 with DDR4 support.',
    price: 11500,
    stock_quantity: 12,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'H770', form_factor: 'ATX', memory: 'DDR4' },
    image_url: ''
  },
  {
    name: 'Gigabyte Z790 AERO G',
    description: 'Designed for creators with VisionLink.',
    price: 24500,
    stock_quantity: 10,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', chipset: 'Z790', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },

  // AMD Motherboards (20 items)
  {
    name: 'ASUS ROG Crosshair X670E Hero',
    description: 'The flagship AM5 motherboard for Ryzen 7000/8000.',
    price: 42500,
    stock_quantity: 5,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'X670E', form_factor: 'ATX', memory: 'DDR5' },
    image_url: '',
    is_new: true
  },
  {
    name: 'MSI MEG X670E ACE',
    description: 'Extreme performance and aesthetics for AM5.',
    price: 48500,
    stock_quantity: 3,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'X670E', form_factor: 'E-ATX', memory: 'DDR5' },
    image_url: '',
    is_new: true
  },
  {
    name: 'ASUS ROG Strix X670E-E Gaming WiFi',
    description: 'High-end AM5 with massive features.',
    price: 32500,
    stock_quantity: 8,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'X670E', form_factor: 'ATX', memory: 'DDR5' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Gigabyte X670E AORUS Master',
    description: 'Robust AM5 board with great cooling.',
    price: 34500,
    stock_quantity: 6,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'X670E', form_factor: 'E-ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'MSI MPG X670E Carbon WiFi',
    description: 'Sleek AM5 board with powerful VRMs.',
    price: 29500,
    stock_quantity: 10,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'X670E', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'ASUS ROG Strix B650-A Gaming WiFi',
    description: 'The best white AM5 motherboard.',
    price: 15800,
    stock_quantity: 20,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'B650', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'MSI MAG B650 Tomahawk WiFi',
    description: 'The go-to AM5 motherboard for reliability.',
    price: 14500,
    stock_quantity: 25,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'B650', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'Gigabyte B650 AORUS Elite AX',
    description: 'Solid B650 with great features.',
    price: 13500,
    stock_quantity: 20,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'B650', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'ASUS TUF Gaming B650-Plus WiFi',
    description: 'Durable and reliable AM5.',
    price: 12500,
    stock_quantity: 30,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'B650', form_factor: 'ATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'MSI MAG B650M Mortar WiFi',
    description: 'Excellent mATX AM5 motherboard.',
    price: 11500,
    stock_quantity: 25,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'B650', form_factor: 'mATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'Gigabyte B650M DS3H',
    description: 'Budget-friendly AM5 entry.',
    price: 8500,
    stock_quantity: 40,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'B650', form_factor: 'mATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'ASRock B650M-HDV/M.2',
    description: 'Ultra-budget AM5 for basic builds.',
    price: 7500,
    stock_quantity: 35,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'B650', form_factor: 'mATX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'ASUS ROG Strix B550-F Gaming WiFi II',
    description: 'The best B550 motherboard for AM4.',
    price: 11500,
    stock_quantity: 15,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', chipset: 'B550', form_factor: 'ATX', memory: 'DDR4' },
    image_url: ''
  },
  {
    name: 'MSI MAG B550 Tomahawk',
    description: 'Reliable and popular AM4 board.',
    price: 9500,
    stock_quantity: 20,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', chipset: 'B550', form_factor: 'ATX', memory: 'DDR4' },
    image_url: ''
  },
  {
    name: 'Gigabyte B550M DS3H AC',
    description: 'Best value AM4 motherboard with WiFi.',
    price: 5800,
    stock_quantity: 50,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', chipset: 'B550', form_factor: 'mATX', memory: 'DDR4' },
    image_url: ''
  },
  {
    name: 'ASUS Prime A520M-K',
    description: 'Ultra-budget AM4 for basic builds.',
    price: 3800,
    stock_quantity: 45,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', chipset: 'A520', form_factor: 'mATX', memory: 'DDR4' },
    image_url: ''
  },
  {
    name: 'ASUS ROG Strix X570-E Gaming WiFi II',
    description: 'High-end AM4 with modern features.',
    price: 18500,
    stock_quantity: 5,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', chipset: 'X570', form_factor: 'ATX', memory: 'DDR4' },
    image_url: ''
  },
  {
    name: 'ASUS ROG Strix B650E-I Gaming WiFi',
    description: 'The ultimate ITX motherboard for AM5.',
    price: 21500,
    stock_quantity: 8,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'B650E', form_factor: 'ITX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'MSI MPG B650I Edge WiFi',
    description: 'Powerful ITX AM5.',
    price: 16500,
    stock_quantity: 10,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'B650', form_factor: 'ITX', memory: 'DDR5' },
    image_url: ''
  },
  {
    name: 'Gigabyte A620M Gaming X',
    description: 'Budget entry for AM5.',
    price: 6800,
    stock_quantity: 25,
    category: 'Motherboard',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', chipset: 'A620', form_factor: 'mATX', memory: 'DDR5' },
    image_url: ''
  },

];

export const RAM_PRODUCTS: Partial<Product>[] = [
  // DDR5 RAM (20 items)
  {
    name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6400 CL32',
    description: 'High-performance DDR5 memory with sleek RGB.',
    price: 9500,
    stock_quantity: 30,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6400MHz', type: 'DDR5', latency: 'CL32' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5-6000 CL30',
    description: 'Reliable and fast DDR5 with iCUE integration.',
    price: 8800,
    stock_quantity: 40,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5', latency: 'CL30' },
    image_url: '',
    is_new: true
  },
  {
    name: 'TeamGroup T-Force Delta RGB 32GB (2x16GB) DDR5-6000 White',
    description: 'Beautiful white DDR5 with wide-angle RGB.',
    price: 8200,
    stock_quantity: 25,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5', latency: 'CL30' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Kingston Fury Renegade RGB 32GB (2x16GB) DDR5-7200',
    description: 'Extreme speed for high-end builds.',
    price: 12500,
    stock_quantity: 15,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '7200MHz', type: 'DDR5', latency: 'CL34' },
    image_url: '',
    is_new: true
  },
  {
    name: 'G.Skill Flare X5 32GB (2x16GB) DDR5-6000 CL30',
    description: 'Optimized for AMD EXPO with low-profile design.',
    price: 7800,
    stock_quantity: 50,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5', latency: 'CL30' },
    image_url: ''
  },
  {
    name: 'Corsair Dominator Titanium 32GB (2x16GB) DDR5-7200',
    description: 'Premium DDR5 with customizable top bars.',
    price: 15500,
    stock_quantity: 10,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '7200MHz', type: 'DDR5', latency: 'CL34' },
    image_url: '',
    is_new: true
  },
  {
    name: 'ADATA XPG Lancer RGB 32GB (2x16GB) DDR5-6000',
    description: 'Solid performance with unique lighting.',
    price: 7500,
    stock_quantity: 30,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5', latency: 'CL40' },
    image_url: ''
  },
  {
    name: 'Crucial Pro 32GB (2x16GB) DDR5-5600',
    description: 'Reliable and stable DDR5 for professional use.',
    price: 6500,
    stock_quantity: 45,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '5600MHz', type: 'DDR5', latency: 'CL46' },
    image_url: ''
  },
  {
    name: 'G.Skill Trident Z5 Royal 32GB (2x16GB) DDR5-7200 Silver',
    description: 'Luxury DDR5 with crystalline light bar.',
    price: 18500,
    stock_quantity: 5,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '7200MHz', type: 'DDR5', latency: 'CL34' },
    image_url: '',
    is_new: true
  },
  {
    name: 'TeamGroup T-Create Expert 32GB (2x16GB) DDR5-6000',
    description: 'Low-profile DDR5 for content creators.',
    price: 7200,
    stock_quantity: 35,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5', latency: 'CL30' },
    image_url: ''
  },
  {
    name: 'Kingston Fury Beast RGB 16GB (2x8GB) DDR5-5200',
    description: 'Affordable entry into DDR5.',
    price: 4500,
    stock_quantity: 50,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '5200MHz', type: 'DDR5', latency: 'CL40' },
    image_url: ''
  },
  {
    name: 'Corsair Vengeance 64GB (2x32GB) DDR5-5600',
    description: 'High capacity for heavy multitasking.',
    price: 14500,
    stock_quantity: 15,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '64GB', speed: '5600MHz', type: 'DDR5', latency: 'CL40' },
    image_url: ''
  },
  {
    name: 'G.Skill Ripjaws S5 32GB (2x16GB) DDR5-6000 Black',
    description: 'Classic performance in a compact design.',
    price: 7400,
    stock_quantity: 40,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5', latency: 'CL36' },
    image_url: ''
  },
  {
    name: 'TeamGroup T-Force Vulcan 32GB (2x16GB) DDR5-5600 Red',
    description: 'Aggressive design and solid performance.',
    price: 6800,
    stock_quantity: 20,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '5600MHz', type: 'DDR5', latency: 'CL36' },
    image_url: ''
  },
  {
    name: 'ADATA XPG Caster RGB 32GB (2x16GB) DDR5-6400',
    description: 'Futuristic design with high speed.',
    price: 8900,
    stock_quantity: 15,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6400MHz', type: 'DDR5', latency: 'CL32' },
    image_url: ''
  },
  {
    name: 'Patriot Viper Venom RGB 32GB (2x16GB) DDR5-7400',
    description: 'Extreme speed for overclocking.',
    price: 13500,
    stock_quantity: 10,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '7400MHz', type: 'DDR5', latency: 'CL36' },
    image_url: ''
  },
  {
    name: 'Lexar Ares RGB 32GB (2x16GB) DDR5-6400',
    description: 'Solid performance and vibrant RGB.',
    price: 7900,
    stock_quantity: 25,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6400MHz', type: 'DDR5', latency: 'CL32' },
    image_url: ''
  },
  {
    name: 'Mushkin Redline Lumina 32GB (2x16GB) DDR5-6000',
    description: 'High performance with a unique look.',
    price: 7600,
    stock_quantity: 15,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5', latency: 'CL36' },
    image_url: ''
  },
  {
    name: 'PNY XLR8 Gaming Mako RGB 32GB (2x16GB) DDR5-6000',
    description: 'Reliable gaming memory with RGB.',
    price: 7700,
    stock_quantity: 20,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '6000MHz', type: 'DDR5', latency: 'CL38' },
    image_url: ''
  },
  {
    name: 'GeIL Polaris RGB 32GB (2x16GB) DDR5-5200',
    description: 'Entry-level DDR5 with RGB.',
    price: 5800,
    stock_quantity: 25,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '5200MHz', type: 'DDR5', latency: 'CL40' },
    image_url: ''
  },

  // DDR4 RAM (20 items)
  {
    name: 'G.Skill Trident Z RGB 16GB (2x8GB) DDR4-3600 CL16',
    description: 'The gold standard for DDR4 gaming memory.',
    price: 4800,
    stock_quantity: 60,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3600MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200 CL16',
    description: 'Low-profile and reliable DDR4.',
    price: 2800,
    stock_quantity: 100,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3200MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'TeamGroup T-Force Delta RGB 16GB (2x8GB) DDR4-3600 White',
    description: 'Popular white DDR4 with great RGB.',
    price: 3500,
    stock_quantity: 80,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3600MHz', type: 'DDR4', latency: 'CL18' },
    image_url: ''
  },
  {
    name: 'Kingston Fury Beast RGB 16GB (2x8GB) DDR4-3200',
    description: 'Solid performance and clean RGB.',
    price: 3200,
    stock_quantity: 70,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3200MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'G.Skill Ripjaws V 16GB (2x8GB) DDR4-3200 Black',
    description: 'Classic value performance.',
    price: 2600,
    stock_quantity: 90,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3200MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4-3600',
    description: 'High capacity and stunning RGB.',
    price: 6500,
    stock_quantity: 40,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '3600MHz', type: 'DDR4', latency: 'CL18' },
    image_url: ''
  },
  {
    name: 'TeamGroup T-Force Vulcan Z 16GB (2x8GB) DDR4-3200 Gray',
    description: 'Best budget DDR4 for AM4.',
    price: 2400,
    stock_quantity: 120,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3200MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'ADATA XPG Spectrix D50 RGB 16GB (2x8GB) DDR4-3600',
    description: 'Geometric design with vibrant RGB.',
    price: 3600,
    stock_quantity: 50,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3600MHz', type: 'DDR4', latency: 'CL18' },
    image_url: ''
  },
  {
    name: 'Crucial Ballistix 16GB (2x8GB) DDR4-3200 Black',
    description: 'Highly compatible and reliable.',
    price: 3400,
    stock_quantity: 30,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3200MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'Patriot Viper Steel 16GB (2x8GB) DDR4-3600',
    description: 'High speed and aggressive design.',
    price: 3300,
    stock_quantity: 45,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3600MHz', type: 'DDR4', latency: 'CL18' },
    image_url: ''
  },
  {
    name: 'G.Skill Trident Z Neo 32GB (2x16GB) DDR4-3600 CL16',
    description: 'Optimized for Ryzen systems.',
    price: 8500,
    stock_quantity: 25,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '3600MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'Corsair Dominator Platinum RGB 32GB (2x16GB) DDR4-3600',
    description: 'Premium DDR4 with Capellix LEDs.',
    price: 9800,
    stock_quantity: 15,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '3600MHz', type: 'DDR4', latency: 'CL18' },
    image_url: ''
  },
  {
    name: 'TeamGroup T-Create Classic 32GB (2x16GB) DDR4-3200',
    description: 'Stable memory for professional workloads.',
    price: 5500,
    stock_quantity: 30,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '32GB', speed: '3200MHz', type: 'DDR4', latency: 'CL22' },
    image_url: ''
  },
  {
    name: 'Kingston Fury Renegade 16GB (2x8GB) DDR4-3600',
    description: 'High performance with a sleek black heatspreader.',
    price: 3800,
    stock_quantity: 40,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3600MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'ADATA XPG Gammix D10 16GB (2x8GB) DDR4-3200',
    description: 'Low-profile budget DDR4.',
    price: 2500,
    stock_quantity: 60,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3200MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'Lexar Thor RGB 16GB (2x8GB) DDR4-3600',
    description: 'Solid performance and great value RGB.',
    price: 3100,
    stock_quantity: 35,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3600MHz', type: 'DDR4', latency: 'CL18' },
    image_url: ''
  },
  {
    name: 'Mushkin Silverline 16GB (2x8GB) DDR4-3200',
    description: 'Simple and effective DDR4.',
    price: 2300,
    stock_quantity: 40,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3200MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'PNY XLR8 Gaming Epic-X RGB 16GB (2x8GB) DDR4-3200',
    description: 'Reliable gaming memory with RGB.',
    price: 3000,
    stock_quantity: 30,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3200MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },
  {
    name: 'GeIL Orion RGB 16GB (2x8GB) DDR4-3600',
    description: 'Unique design with vibrant RGB.',
    price: 3400,
    stock_quantity: 25,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3600MHz', type: 'DDR4', latency: 'CL18' },
    image_url: ''
  },
  {
    name: 'Silicon Power Turbine 16GB (2x8GB) DDR4-3200',
    description: 'Budget-friendly performance.',
    price: 2200,
    stock_quantity: 50,
    category: 'RAM',
    parent_category: 'Core Components',
    specs: { capacity: '16GB', speed: '3200MHz', type: 'DDR4', latency: 'CL16' },
    image_url: ''
  },

];
