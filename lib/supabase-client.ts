import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Export Supabase client factory
export function createClient(url: string, key: string) {
  return supabaseCreateClient(url, key)
}
