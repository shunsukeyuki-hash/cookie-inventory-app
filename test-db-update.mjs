import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://coeczeemzqyeutarjkzk.supabase.co',
  'sb_publishable_E2NpnhWHOKihzyY6uTu4Ww_KWZxFjRJ'
);

async function testUpdate() {
  const { data: fetch, error: fetchError } = await supabase.from('inventory_items').select('*').limit(1);
  if (fetchError || !fetch || fetch.length === 0) {
    console.log('Fetch error:', fetchError);
    return;
  }
  
  const id = fetch[0].id;
  console.log('Updating item ID:', id);

  const { error } = await supabase
    .from('inventory_items')
    .update({ quantity: 9999, last_updated: new Date().toISOString() })
    .eq('id', id);

  console.log('Update error:', error);
  
  const { data: verify } = await supabase.from('inventory_items').select('*').eq('id', id);
  console.log('Verified data:', verify[0].quantity);
}

testUpdate();
