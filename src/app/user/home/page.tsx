import createSupabaseServerClient from "@/app/_lib/_supabase_server_client";

export default async function User() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    return <>
        <h1>Welcome home {user?.email}</h1>
    </>
}