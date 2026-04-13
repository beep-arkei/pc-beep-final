import { Product } from '../types';

export const GPU_PRODUCTS: Partial<Product>[] = [
  // NVIDIA GPUs (20 items)
  {
    name: 'NVIDIA GeForce RTX 4090 Founders Edition',
    description: 'The ultimate graphics card for 4K gaming and beyond.',
    price: 115000,
    stock_quantity: 5,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4090', vram: '24GB GDDR6X', tdp: '450W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'ASUS ROG Strix RTX 4090 OC',
    description: 'Premium cooling and massive performance.',
    price: 128500,
    stock_quantity: 3,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4090', vram: '24GB GDDR6X', tdp: '450W+', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'NVIDIA GeForce RTX 4080 Super',
    description: 'High-end performance for enthusiasts.',
    price: 68500,
    stock_quantity: 10,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4080 Super', vram: '16GB GDDR6X', tdp: '320W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true,
    is_deal: true,
    discount_price: 65000
  },
  {
    name: 'MSI Suprim X RTX 4080 Super',
    description: 'Luxury design with exceptional cooling.',
    price: 74500,
    stock_quantity: 5,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4080 Super', vram: '16GB GDDR6X', tdp: '320W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'NVIDIA GeForce RTX 4070 Ti Super',
    description: 'The perfect card for 1440p high-refresh gaming.',
    price: 52500,
    stock_quantity: 15,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4070 Ti Super', vram: '16GB GDDR6X', tdp: '285W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Gigabyte Gaming OC RTX 4070 Ti Super',
    description: 'Reliable performance with triple fan cooling.',
    price: 54500,
    stock_quantity: 10,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4070 Ti Super', vram: '16GB GDDR6X', tdp: '285W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'NVIDIA GeForce RTX 4070 Super',
    description: 'The sweet spot for modern gaming.',
    price: 38500,
    stock_quantity: 20,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4070 Super', vram: '12GB GDDR6X', tdp: '220W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'ZOTAC Trinity RTX 4070 Super',
    description: 'Compact and powerful triple fan design.',
    price: 37500,
    stock_quantity: 15,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4070 Super', vram: '12GB GDDR6X', tdp: '220W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'NVIDIA GeForce RTX 4060 Ti 16GB',
    description: 'Extra VRAM for demanding textures and AI work.',
    price: 28500,
    stock_quantity: 12,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4060 Ti', vram: '16GB GDDR6', tdp: '165W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'NVIDIA GeForce RTX 4060 Ti 8GB',
    description: 'Solid 1080p and 1440p performance.',
    price: 23500,
    stock_quantity: 20,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4060 Ti', vram: '8GB GDDR6', tdp: '160W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'NVIDIA GeForce RTX 4060',
    description: 'Efficient and powerful for 1080p gaming.',
    price: 18500,
    stock_quantity: 30,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4060', vram: '8GB GDDR6', tdp: '115W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'ASUS Dual RTX 4060 White OC',
    description: 'Clean white aesthetics for compact builds.',
    price: 19800,
    stock_quantity: 15,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 4060', vram: '8GB GDDR6', tdp: '115W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'NVIDIA GeForce RTX 3060 12GB',
    description: 'The most popular GPU for a reason.',
    price: 16500,
    stock_quantity: 25,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 3060', vram: '12GB GDDR6', tdp: '170W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'NVIDIA GeForce RTX 3050 6GB',
    description: 'Entry-level ray tracing for budget builds.',
    price: 11500,
    stock_quantity: 20,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 3050', vram: '6GB GDDR6', tdp: '70W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'NVIDIA GeForce RTX 3070 Ti',
    description: 'High performance from the previous generation.',
    price: 28500,
    stock_quantity: 5,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 3070 Ti', vram: '8GB GDDR6X', tdp: '290W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'NVIDIA GeForce RTX 3080 10GB',
    description: 'Still a beast for 4K gaming.',
    price: 35500,
    stock_quantity: 3,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 3080', vram: '10GB GDDR6X', tdp: '320W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'NVIDIA GeForce GTX 1650',
    description: 'The budget king for basic 1080p gaming.',
    price: 8500,
    stock_quantity: 15,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'GTX 1650', vram: '4GB GDDR6', tdp: '75W', interface: 'PCIe 3.0' },
    image_url: ''
  },
  {
    name: 'NVIDIA GeForce GTX 1660 Super',
    description: 'Solid performance for older systems.',
    price: 12500,
    stock_quantity: 10,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'GTX 1660 Super', vram: '6GB GDDR6', tdp: '125W', interface: 'PCIe 3.0' },
    image_url: ''
  },
  {
    name: 'NVIDIA GeForce RTX 2060 Super',
    description: 'Refurbished high-value option.',
    price: 13500,
    stock_quantity: 5,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RTX 2060 Super', vram: '8GB GDDR6', tdp: '175W', interface: 'PCIe 3.0' },
    image_url: ''
  },
  {
    name: 'NVIDIA GeForce GT 1030',
    description: 'Basic display output and light media tasks.',
    price: 4500,
    stock_quantity: 15,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'GT 1030', vram: '2GB GDDR5', tdp: '30W', interface: 'PCIe 3.0' },
    image_url: ''
  },

  // AMD GPUs (20 items)
  {
    name: 'AMD Radeon RX 7900 XTX Founders',
    description: 'The flagship Radeon for elite gaming.',
    price: 65500,
    stock_quantity: 8,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 7900 XTX', vram: '24GB GDDR6', tdp: '355W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Sapphire Nitro+ RX 7900 XTX',
    description: 'The best cooling and performance for Radeon.',
    price: 72500,
    stock_quantity: 5,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 7900 XTX', vram: '24GB GDDR6', tdp: '355W+', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Radeon RX 7900 XT',
    description: 'High-end 4K gaming performance.',
    price: 54500,
    stock_quantity: 10,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 7900 XT', vram: '20GB GDDR6', tdp: '315W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'PowerColor Hellhound RX 7900 XT',
    description: 'Sleek design with great thermal performance.',
    price: 56500,
    stock_quantity: 7,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 7900 XT', vram: '20GB GDDR6', tdp: '315W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Radeon RX 7800 XT',
    description: 'The 1440p value king.',
    price: 32500,
    stock_quantity: 20,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 7800 XT', vram: '16GB GDDR6', tdp: '263W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'ASRock Steel Legend RX 7800 XT White',
    description: 'Beautiful white design for high-end builds.',
    price: 34500,
    stock_quantity: 12,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 7800 XT', vram: '16GB GDDR6', tdp: '263W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Radeon RX 7700 XT',
    description: 'Solid 1440p gaming performance.',
    price: 28500,
    stock_quantity: 15,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 7700 XT', vram: '12GB GDDR6', tdp: '245W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Radeon RX 7600 XT 16GB',
    description: 'Massive VRAM for a mid-range card.',
    price: 21500,
    stock_quantity: 18,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 7600 XT', vram: '16GB GDDR6', tdp: '190W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Radeon RX 7600',
    description: 'Great value for 1080p gaming.',
    price: 16500,
    stock_quantity: 25,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 7600', vram: '8GB GDDR6', tdp: '165W', interface: 'PCIe 4.0' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Radeon RX 6950 XT',
    description: 'The peak of the previous generation.',
    price: 42500,
    stock_quantity: 5,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 6950 XT', vram: '16GB GDDR6', tdp: '335W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'AMD Radeon RX 6800 XT',
    description: 'Still a fantastic 1440p card.',
    price: 29500,
    stock_quantity: 8,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 6800 XT', vram: '16GB GDDR6', tdp: '300W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'AMD Radeon RX 6800',
    description: 'High VRAM and great efficiency.',
    price: 24500,
    stock_quantity: 10,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 6800', vram: '16GB GDDR6', tdp: '250W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'AMD Radeon RX 6750 XT',
    description: 'Refined mid-range performance.',
    price: 21500,
    stock_quantity: 15,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 6750 XT', vram: '12GB GDDR6', tdp: '250W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'AMD Radeon RX 6700 XT',
    description: 'The 1440p champion of its time.',
    price: 18500,
    stock_quantity: 20,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 6700 XT', vram: '12GB GDDR6', tdp: '230W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'AMD Radeon RX 6650 XT',
    description: 'Solid 1080p performance.',
    price: 15500,
    stock_quantity: 20,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 6650 XT', vram: '8GB GDDR6', tdp: '176W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'AMD Radeon RX 6600 XT',
    description: 'Efficient and powerful for 1080p.',
    price: 14500,
    stock_quantity: 15,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 6600 XT', vram: '8GB GDDR6', tdp: '160W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'AMD Radeon RX 6600',
    description: 'The best value 1080p card.',
    price: 12500,
    stock_quantity: 30,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 6600', vram: '8GB GDDR6', tdp: '132W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'AMD Radeon RX 6500 XT',
    description: 'Budget entry for basic gaming.',
    price: 9500,
    stock_quantity: 20,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 6500 XT', vram: '4GB GDDR6', tdp: '107W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'AMD Radeon RX 6400',
    description: 'Low-profile entry-level graphics.',
    price: 7500,
    stock_quantity: 15,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 6400', vram: '4GB GDDR6', tdp: '53W', interface: 'PCIe 4.0' },
    image_url: ''
  },
  {
    name: 'AMD Radeon RX 580 8GB (Refurbished)',
    description: 'The legend that never dies.',
    price: 5500,
    stock_quantity: 50,
    category: 'GPU',
    parent_category: 'Core Components',
    specs: { chipset: 'RX 580', vram: '8GB GDDR5', tdp: '185W', interface: 'PCIe 3.0' },
    image_url: ''
  }
];
