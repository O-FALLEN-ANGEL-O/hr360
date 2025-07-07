import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types'

// IMPORTANT: This client is for server-side use ONLY and bypasses RLS.
// Do not expose this client or the service_role_key to the browser.

export const createAdminClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase URL or service role key for admin client.')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
