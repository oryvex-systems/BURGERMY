import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
  'https://wdimzayfvtlrxljpsvza.supabase.co',
  'sb_publishable_FZwX09JGrJt3Q9WXW3V1dQ_-g9aegh4',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);
