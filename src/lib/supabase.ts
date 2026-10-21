import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** true, gdy w .env.local są uzupełnione klucze Supabase */
export const hasSupabase = Boolean(url && key && !url.includes("TWOJ-PROJEKT"));

let client: SupabaseClient | null = null;

/** Klient do odczytu publicznych danych. Zwraca null, jeśli brak kluczy. */
export function getSupabase(): SupabaseClient | null {
  if (!hasSupabase) return null;
  client ??= createClient(url!, key!, { auth: { persistSession: false } });
  return client;
}
