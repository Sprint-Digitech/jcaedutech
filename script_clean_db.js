const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://yzbdtapgkbbzxdtbaiuy.supabase.co', 'sb_publishable_bkEEF3dJHNCW_m-dvsuurg_uhX6VCbt');
async function clean() {
  const { data, error } = await supabase.from('registration_submissions').delete().neq('id', 0);
  console.log('Deleted all records. Error:', error);
}
clean();
