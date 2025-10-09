import { createClient } from "@supabase/supabase-js";

export const createSupabaseClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error("Missing Supabase environment variables");
    throw new Error("Supabase configuration is missing. Please check your environment variables.");
  }
  
  return createClient(url, key);
};

// For server-side operations that need to bypass RLS
export const createSupabaseServiceClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL");
    throw new Error("Supabase URL is missing. Please check your environment variables.");
  }
  
  if (!serviceRoleKey) {
    console.warn("SUPABASE_SERVICE_ROLE_KEY not found, falling back to anon key");
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!anonKey) {
      throw new Error("Both service role key and anon key are missing. Please check your environment variables.");
    }
    return createClient(url, anonKey);
  }
  
  return createClient(url, serviceRoleKey);
};
