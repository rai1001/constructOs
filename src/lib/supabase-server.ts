import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-side client with service role key — bypasses RLS
// Only use in API routes (server-side), NEVER import from client components

let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY not set. Add it to .env.local (get it from Supabase Dashboard → Settings → API → service_role)"
    );
  }

  _client = createClient(url, key);
  return _client;
}
