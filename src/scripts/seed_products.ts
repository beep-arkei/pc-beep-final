import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { CPU_PRODUCTS } from '../data/products_cpu';
import { GPU_PRODUCTS } from '../data/products_gpu';
import { MOTHERBOARD_PRODUCTS, RAM_PRODUCTS } from '../data/products_mobo_ram';
import { STORAGE_PRODUCTS, PSU_PRODUCTS } from '../data/products_storage_psu';
import { CASE_PRODUCTS, COOLING_PRODUCTS } from '../data/products_case_cooling';
import { MONITOR_PRODUCTS, PERIPHERAL_PRODUCTS } from '../data/products_peripherals';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const allProducts = [
  ...CPU_PRODUCTS,
  ...GPU_PRODUCTS,
  ...MOTHERBOARD_PRODUCTS,
  ...RAM_PRODUCTS,
  ...STORAGE_PRODUCTS,
  ...PSU_PRODUCTS,
  ...CASE_PRODUCTS,
  ...COOLING_PRODUCTS,
  ...MONITOR_PRODUCTS,
  ...PERIPHERAL_PRODUCTS,
];

async function seed() {
  console.log(`Starting seeding ${allProducts.length} products...`);

  // Optional: Clear existing products if you want a fresh start
  // const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  // if (deleteError) console.error('Error clearing products:', deleteError);

  const { data, error } = await supabase
    .from('products')
    .insert(allProducts)
    .select();

  if (error) {
    console.error('Error seeding products:', error);
  } else {
    console.log(`Successfully seeded ${data?.length} products.`);
  }
}

seed();
