'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserHomePage() {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();

    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        async function authenticateUser() {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                router.push('/');
            }

            setUser(data.user);
        };

        authenticateUser();
    }, []);

    const handleLogout = async function logoutUser() {
        let { error } = await supabase.auth.signOut();

        if (error) {
            setStatus(error.message);
            return;
        }

        router.push('/');
    }

    return <>
        <h1>Welcome home {user?.email}</h1>
        <p>{status}</p>
        <button onClick={handleLogout}>logout</button>
    </>
}