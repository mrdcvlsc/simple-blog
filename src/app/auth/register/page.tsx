'use client';

import React, { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypedPassword] = useState('');
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

        if (password != retypePassword) {
            setStatus('re-typed password does not match');
            return;
        }

        const { error, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/user/home`
            }
        });

        if (error) {
            setStatus(error.message);
            return;
        }

        setStatus('account created');
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

            <div>
                <input
                    type='password'
                    value={retypePassword}
                    onChange={(e) => setRetypedPassword(e.target.value)}
                    placeholder='Re-typed Password'
                    required
                />
                <p>{status}</p>
            </div>
            <button type='submit'>Sign-up</button>
        </form>
    </>
}