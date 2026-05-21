require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const correctHash = '$2a$10$jWJuSaqm0my6lanRK6T20e5sUyYwWR5QTTlJMXs7phCi.vbnuxzfS';

supabase.from('users')
  .update({ password_hash: correctHash })
  .eq('username', 'admin')
  .then(r => {
    console.log('Password restored successfully!');
    process.exit(0);
  });
