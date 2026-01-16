import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getEnv } from "@/app/_lib/_getenv";
import { Database } from "./database.types";

export async function createSupabaseServerClient() {
  const supabaseURL = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseApiKey = getEnv("NEXT_PUBLIC_SUPABASE_API_KEY");

  const cookieStore = await cookies();

  console.log('   supabaseURL :', supabaseURL);
  console.log('supabaseApiKey :', supabaseApiKey);

  return createServerClient<Database>(supabaseURL, supabaseApiKey, {
    cookies: {
      getAll() { // reads all the cookies from the incoming request
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) { // updates all cookies
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          })
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
}

export default createSupabaseServerClient;