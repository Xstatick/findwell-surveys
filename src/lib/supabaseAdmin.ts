import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key. This bypasses RLS,
// so it must never be imported into client components. The service role key is
// NOT prefixed with NEXT_PUBLIC_ and therefore is never sent to the browser.
let _admin: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (typeof window !== "undefined") {
    throw new Error("getSupabaseAdmin() must only be called on the server");
  }
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }
    _admin = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return _admin;
}
