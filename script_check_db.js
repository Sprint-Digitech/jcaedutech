const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://yzbdtapgkbbzxdtbaiuy.supabase.co', 'sb_publishable_bkEEF3dJHNCW_m-dvsuurg_uhX6VCbt');
async function check() {
  const { data, error } = await supabase.from('registration_submissions').select('*');
  console.log('Error:', error);
  console.log('Data:', data);
}
check();
