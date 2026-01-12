import { createClient } from "@supabase/supabase-js";
import { getEnv } from "@/app/_lib/_getenv";

const supabaseURL = getEnv("SUPABASE_URL");
const supabaseApiKey = getEnv("SUPABASE_API_KEY");

console.log('   supabaseURL :', supabaseURL);
console.log('supabaseApiKey :', supabaseApiKey);

const supabase = createClient(supabaseURL, supabaseApiKey);

export default supabase;