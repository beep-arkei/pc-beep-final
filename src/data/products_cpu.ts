import { Product } from '../types';

export const CPU_PRODUCTS: Partial<Product>[] = [
  // AMD CPUs (20 items)
  {
    name: 'AMD Ryzen 9 7950X3D',
    description: 'The ultimate gaming and creator processor with 3D V-Cache.',
    price: 42500,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', cores: 16, threads: 32, base_clock: '4.2GHz', boost_clock: '5.7GHz', tdp: '120W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Ryzen 9 7900X3D',
    description: 'High-performance gaming CPU with 12 cores and 3D V-Cache.',
    price: 34500,
    stock_quantity: 12,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', cores: 12, threads: 24, base_clock: '4.4GHz', boost_clock: '5.6GHz', tdp: '120W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Ryzen 7 7800X3D',
    description: 'The world\'s best gaming processor.',
    price: 26500,
    stock_quantity: 25,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', cores: 8, threads: 16, base_clock: '4.2GHz', boost_clock: '5.0GHz', tdp: '120W' },
    image_url: '',
    is_new: true,
    is_deal: true,
    discount_price: 24500
  },
  {
    name: 'AMD Ryzen 9 7950X',
    description: 'Flagship 16-core processor for heavy multitasking and production.',
    price: 38500,
    stock_quantity: 10,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', cores: 16, threads: 32, base_clock: '4.5GHz', boost_clock: '5.7GHz', tdp: '170W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 9 7900X',
    description: 'Powerful 12-core processor for enthusiasts.',
    price: 29500,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', cores: 12, threads: 24, base_clock: '4.7GHz', boost_clock: '5.6GHz', tdp: '170W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 7 7700X',
    description: 'Excellent 8-core performance for gaming and productivity.',
    price: 21500,
    stock_quantity: 20,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', cores: 8, threads: 16, base_clock: '4.5GHz', boost_clock: '5.4GHz', tdp: '105W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 5 7600X',
    description: 'The entry point to the AM5 platform with great gaming speed.',
    price: 15500,
    stock_quantity: 30,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', cores: 6, threads: 12, base_clock: '4.7GHz', boost_clock: '5.3GHz', tdp: '105W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 7 5800X3D',
    description: 'The legendary AM4 gaming king.',
    price: 18500,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 8, threads: 16, base_clock: '3.4GHz', boost_clock: '4.5GHz', tdp: '105W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 9 5950X',
    description: '16 cores of pure AM4 power.',
    price: 28500,
    stock_quantity: 8,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 16, threads: 32, base_clock: '3.4GHz', boost_clock: '4.9GHz', tdp: '105W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 9 5900X',
    description: '12 cores for high-end AM4 builds.',
    price: 22500,
    stock_quantity: 12,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 12, threads: 24, base_clock: '3.7GHz', boost_clock: '4.8GHz', tdp: '105W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 7 5700X3D',
    description: 'Affordable 3D V-Cache for AM4 users.',
    price: 14500,
    stock_quantity: 20,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 8, threads: 16, base_clock: '3.0GHz', boost_clock: '4.1GHz', tdp: '105W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Ryzen 7 5800X',
    description: 'Solid 8-core performance for AM4.',
    price: 15500,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 8, threads: 16, base_clock: '3.8GHz', boost_clock: '4.7GHz', tdp: '105W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 7 5700X',
    description: 'Efficient 8-core CPU for mid-range builds.',
    price: 11500,
    stock_quantity: 25,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 8, threads: 16, base_clock: '3.4GHz', boost_clock: '4.6GHz', tdp: '65W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 5 5600X',
    description: 'The classic mid-range gaming choice.',
    price: 9500,
    stock_quantity: 40,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 6, threads: 12, base_clock: '3.7GHz', boost_clock: '4.6GHz', tdp: '65W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 5 5600',
    description: 'Best value 6-core processor for AM4.',
    price: 7500,
    stock_quantity: 50,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 6, threads: 12, base_clock: '3.5GHz', boost_clock: '4.4GHz', tdp: '65W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 5 5500',
    description: 'Budget-friendly 6-core CPU.',
    price: 5800,
    stock_quantity: 35,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 6, threads: 12, base_clock: '3.6GHz', boost_clock: '4.2GHz', tdp: '65W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 5 8600G',
    description: 'Latest APU with powerful integrated graphics.',
    price: 14500,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', cores: 6, threads: 12, graphics: 'Radeon 760M', tdp: '65W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Ryzen 7 8700G',
    description: 'Top-tier APU for gaming without a dedicated GPU.',
    price: 19500,
    stock_quantity: 10,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM5', cores: 8, threads: 16, graphics: 'Radeon 780M', tdp: '65W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'AMD Ryzen 5 4500',
    description: 'Ultra-budget 6-core CPU for basic builds.',
    price: 4500,
    stock_quantity: 20,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 6, threads: 12, base_clock: '3.6GHz', boost_clock: '4.1GHz', tdp: '65W' },
    image_url: ''
  },
  {
    name: 'AMD Ryzen 3 4100',
    description: 'Entry-level quad-core processor.',
    price: 3800,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'AM4', cores: 4, threads: 8, base_clock: '3.8GHz', boost_clock: '4.0GHz', tdp: '65W' },
    image_url: ''
  },

  // Intel CPUs (20 items)
  {
    name: 'Intel Core i9-14900KS',
    description: 'Special edition processor with 6.2GHz boost clock.',
    price: 45500,
    stock_quantity: 5,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 24, threads: 32, boost_clock: '6.2GHz', tdp: '150W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Intel Core i9-14900K',
    description: 'The ultimate performance for gaming and creation.',
    price: 36500,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 24, threads: 32, boost_clock: '6.0GHz', tdp: '125W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Intel Core i7-14700K',
    description: 'High-end performance with extra E-cores.',
    price: 26500,
    stock_quantity: 20,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 20, threads: 28, boost_clock: '5.6GHz', tdp: '125W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Intel Core i5-14600K',
    description: 'The best mid-range gaming CPU from Intel.',
    price: 19500,
    stock_quantity: 25,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 14, threads: 20, boost_clock: '5.3GHz', tdp: '125W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Intel Core i9-13900K',
    description: 'Previous gen flagship, still incredibly powerful.',
    price: 32500,
    stock_quantity: 10,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 24, threads: 32, boost_clock: '5.8GHz', tdp: '125W' },
    image_url: ''
  },
  {
    name: 'Intel Core i7-13700K',
    description: 'Solid high-end choice for 13th gen.',
    price: 23500,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 16, threads: 24, boost_clock: '5.4GHz', tdp: '125W' },
    image_url: ''
  },
  {
    name: 'Intel Core i5-13600K',
    description: 'Legendary mid-range performance.',
    price: 17500,
    stock_quantity: 20,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 14, threads: 20, boost_clock: '5.1GHz', tdp: '125W' },
    image_url: ''
  },
  {
    name: 'Intel Core i5-13400F',
    description: 'Great value gaming CPU without integrated graphics.',
    price: 12500,
    stock_quantity: 30,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 10, threads: 16, boost_clock: '4.6GHz', tdp: '65W' },
    image_url: ''
  },
  {
    name: 'Intel Core i3-13100F',
    description: 'Budget gaming king.',
    price: 6800,
    stock_quantity: 40,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 4, threads: 8, boost_clock: '4.5GHz', tdp: '58W' },
    image_url: ''
  },
  {
    name: 'Intel Core i9-12900K',
    description: 'The first hybrid architecture flagship.',
    price: 24500,
    stock_quantity: 8,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 16, threads: 24, boost_clock: '5.2GHz', tdp: '125W' },
    image_url: ''
  },
  {
    name: 'Intel Core i7-12700K',
    description: 'Excellent 12th gen performance.',
    price: 18500,
    stock_quantity: 12,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 12, threads: 20, boost_clock: '5.0GHz', tdp: '125W' },
    image_url: ''
  },
  {
    name: 'Intel Core i5-12600K',
    description: 'The CPU that brought Intel back to the top.',
    price: 14500,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 10, threads: 16, boost_clock: '4.9GHz', tdp: '125W' },
    image_url: ''
  },
  {
    name: 'Intel Core i5-12400F',
    description: 'Still one of the best value gaming CPUs.',
    price: 8500,
    stock_quantity: 50,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 6, threads: 12, boost_clock: '4.4GHz', tdp: '65W' },
    image_url: ''
  },
  {
    name: 'Intel Core i3-12100F',
    description: 'Unbeatable entry-level gaming performance.',
    price: 5500,
    stock_quantity: 45,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 4, threads: 8, boost_clock: '4.3GHz', tdp: '58W' },
    image_url: ''
  },
  {
    name: 'Intel Core i7-14700F',
    description: 'High-end performance without overclocking.',
    price: 24500,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 20, threads: 28, boost_clock: '5.4GHz', tdp: '65W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Intel Core i5-14400F',
    description: 'Latest mid-range value choice.',
    price: 13500,
    stock_quantity: 25,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 10, threads: 16, boost_clock: '4.7GHz', tdp: '65W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Intel Core i5-14500',
    description: 'Versatile CPU with integrated graphics.',
    price: 15500,
    stock_quantity: 15,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1700', cores: 14, threads: 20, boost_clock: '5.0GHz', tdp: '65W' },
    image_url: '',
    is_new: true
  },
  {
    name: 'Intel Core i7-11700K',
    description: 'Older gen but still capable for many tasks.',
    price: 12500,
    stock_quantity: 5,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1200', cores: 8, threads: 16, boost_clock: '5.0GHz', tdp: '125W' },
    image_url: ''
  },
  {
    name: 'Intel Core i5-11400F',
    description: 'Budget 11th gen gaming.',
    price: 6500,
    stock_quantity: 10,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1200', cores: 6, threads: 12, boost_clock: '4.4GHz', tdp: '65W' },
    image_url: ''
  },
  {
    name: 'Intel Core i9-10900K',
    description: 'The last 14nm flagship.',
    price: 15500,
    stock_quantity: 3,
    category: 'CPU',
    parent_category: 'Core Components',
    specs: { socket: 'LGA1200', cores: 10, threads: 20, boost_clock: '5.3GHz', tdp: '125W' },
    image_url: ''
  }
];
