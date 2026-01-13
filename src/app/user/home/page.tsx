'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from 'react';

export default function UserHomePage() {
    const supabase = getSupabaseBrowserClient();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function authenticateUser() {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };

        authenticateUser();
    }, []);

    return <>
        <h1>Welcome home {user?.email}</h1>
    </>
}