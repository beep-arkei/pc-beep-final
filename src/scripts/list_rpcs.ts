import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listRPCs() {
  const { data, error } = await supabase
    .from('pg_proc')
    .select('proname')
    .limit(10);

  if (error) {
    console.error('Error listing RPCs:', error);
  } else {
    console.log('RPCs:', data);
  }
}

listRPCs();
