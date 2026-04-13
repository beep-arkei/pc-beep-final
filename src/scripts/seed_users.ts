import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const users = [
  {
    email: 'admin@pcbeep.com',
    password: 'Admin123!',
    username: 'admin_user',
    role: 'admin'
  },
  {
    email: 'owner@pcbeep.com',
    password: 'Owner123!',
    username: 'owner_user',
    role: 'owner'
  }
];

async function seedUsers() {
  console.log('Starting user seeding...');

  for (const userData of users) {
    console.log(`Processing user: ${userData.email}`);
    
    // Check if user exists in auth.users
    const { data: { users: existingUsers }, error: listError } = await supabase.auth.admin.listUsers() as any;
    
    if (listError) {
      console.error('Error listing users:', listError);
      continue;
    }

    let user = existingUsers.find(u => u.email === userData.email);

    if (!user) {
      console.log(`Creating auth user: ${userData.email}`);
      const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (createError) {
        console.error(`Error creating user ${userData.email}:`, createError);
        continue;
      }
      user = newUser;
    } else {
      console.log(`User ${userData.email} already exists.`);
    }

    if (user) {
      console.log(`Updating profile for: ${userData.email} (ID: ${user.id})`);
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: userData.username,
          role: userData.role
        }, { onConflict: 'id' });

      if (profileError) {
        console.error(`Error updating profile for ${userData.email}:`, profileError);
      } else {
        console.log(`Successfully seeded user: ${userData.email}`);
      }
    }
  }

  console.log('User seeding completed.');
}

seedUsers();
