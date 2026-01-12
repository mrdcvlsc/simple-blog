'use client';

import { createBrowserClient } from "@supabase/ssr";
import { getEnv } from "@/app/_lib/_getenv";

import type { SupabaseClient } from "@supabase/supabase-js";

type SupabaseSchema = Record<string, never>;

let client: SupabaseClient<SupabaseSchema> | null = null;

export function getSupabaseBrowserClient(): SupabaseClient<SupabaseSchema> {

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

  client = createBrowserClient<SupabaseSchema>(supabaseURL, supabaseApiKey);
  return client;
}

export default getSupabaseBrowserClient;