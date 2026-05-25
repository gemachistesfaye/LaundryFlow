/**
 * Migration: Add 'payment_pending' to laundry_orders status enum
 * 
 * Run this once:  node backend/migrations/add_payment_pending_status.js
 * 
 * OR run the SQL below directly in the Supabase Dashboard → SQL Editor:
 * 
 *   ALTER TYPE laundry_orders_status_enum ADD VALUE IF NOT EXISTS 'payment_pending' AFTER 'ready';
 * 
 * If your status column is not an enum but a text check constraint, use:
 * 
 *   ALTER TABLE laundry_orders DROP CONSTRAINT IF EXISTS laundry_orders_status_check;
 *   ALTER TABLE laundry_orders ADD CONSTRAINT laundry_orders_status_check
 *     CHECK (status IN ('submitted','assigned','washing','drying','ready','payment_pending','out_for_delivery','delivered','cancelled'));
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

async function migrate() {
  console.log('Running migration: add payment_pending status...');

  // Try to update a dummy row — if it fails with enum error, the value isn't in the enum yet
  const { error: testError } = await supabase
    .from('laundry_orders')
    .update({ status: 'payment_pending' })
    .eq('id', -1); // id that doesn't exist — no rows affected

  if (testError && testError.message.includes('invalid input value for enum')) {
    console.error('\n❌ Supabase enum does not include "payment_pending".');
    console.error('👉 Please run the following SQL in your Supabase Dashboard → SQL Editor:\n');
    console.error(`   ALTER TYPE laundry_orders_status_enum ADD VALUE IF NOT EXISTS 'payment_pending' AFTER 'ready';\n`);
    console.error('   If that fails (no named enum), try:\n');
    console.error(`   ALTER TABLE laundry_orders DROP CONSTRAINT IF EXISTS laundry_orders_status_check;`);
    console.error(`   ALTER TABLE laundry_orders ADD CONSTRAINT laundry_orders_status_check`);
    console.error(`     CHECK (status IN ('submitted','assigned','washing','drying','ready','payment_pending','out_for_delivery','delivered','cancelled'));`);
    process.exit(1);
  }

  console.log('✅ Migration check passed. "payment_pending" is accepted by the database.');
  process.exit(0);
}

migrate();
