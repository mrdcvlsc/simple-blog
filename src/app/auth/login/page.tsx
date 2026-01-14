'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        async function getAuthenticatedUser() {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (!error && user) {
                router.push('/user/home');
            }
        }

        getAuthenticatedUser();
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();


        let { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setStatus(error.message);
            return;
        }

        router.push('/user/home');
    }

    return <>
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='Email'
                    required
                />
            </div>

            <div>
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    required
                />
            </div>
            <p>{status}</p>
            <button type='submit'>Login</button>
        </form>
    </>
}