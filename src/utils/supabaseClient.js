import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://uuchsrqtlrbsxcaymxoa.supabase.co';

const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_PfqjGKlhBJJN4BHKSsWKNw_noNm9Vnf';

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
