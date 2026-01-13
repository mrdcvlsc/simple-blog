'use client';

import { createBrowserClient } from "@supabase/ssr";
import { getEnv } from "@/app/_lib/_getenv";
import { Database } from '@/app/_lib/database.types';

import type { SupabaseClient } from "@supabase/supabase-js";


let client: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient(): SupabaseClient<Database> {

  if (client) {
    return client;
  }

  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseApiKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  if (!supabaseURL) {
    throw new Error(`Missing NEXT_PUBLIC_SUPABASE_URL : ${supabaseURL}`);
  }

  if (!supabaseApiKey) {
    throw new Error(`Missing NEXT_PUBLIC_SUPABASE_API_KEY : ${supabaseApiKey}`);
  }

  client = createBrowserClient<Database>(supabaseURL, supabaseApiKey);
  return client;
}

export default getSupabaseBrowserClient;