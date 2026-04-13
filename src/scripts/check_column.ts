import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addColumn() {
  // Supabase doesn't allow direct ALTER TABLE via the JS client unless you use RPC or have a specific setup.
  // But let's check if we can use the SQL API if available (usually not).
  
  console.log('Attempting to check if parent_category exists...');
  const { data, error } = await supabase
    .from('products')
    .select('parent_category')
    .limit(1);

  if (error) {
    console.error('Error checking column:', error);
    if (error.message.includes('column "parent_category" does not exist')) {
      console.log('Column does not exist. Please add it in the Supabase SQL Editor:');
      console.log('ALTER TABLE products ADD COLUMN parent_category TEXT NOT NULL DEFAULT \'Core Components\';');
    }
  } else {
    console.log('Column exists.');
  }
}

addColumn();
