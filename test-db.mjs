import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://coeczeemzqyeutarjkzk.supabase.co',
  'sb_publishable_E2NpnhWHOKihzyY6uTu4Ww_KWZxFjRJ'
);

async function test() {
  const { data, error } = await supabase.from('inventory_items').select('*');
  console.log('Error:', error);
  console.log('Data count:', data ? data.length : 0);
  console.log('Sample data:', data ? data.slice(0, 2) : null);
}

test();
