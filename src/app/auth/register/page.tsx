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
        router.push('/user/home');
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-280px)] px-4 sm:px-0">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text mb-2">
                        Join Droplet
                    </h1>
                    <p className="text-gray-600">Create your account and start sharing</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-card space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder='name@example.com'
                            className='glass-input'
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='Create a strong password'
                            className='glass-input'
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type='password'
                            value={retypePassword}
                            onChange={(e) => setRetypedPassword(e.target.value)}
                            placeholder='Confirm your password'
                            className='glass-input'
                            required
                        />
                    </div>

                    {status && (
                        <div className={`p-3 rounded-lg border text-sm ${
                            status.includes('created')
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                            {status}
                        </div>
                    )}

                    <button type='submit' className='glass-button-primary w-full text-lg font-semibold'>
                        Create Account
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Already have an account?{' '}
                    <a href='/auth/login' className="text-sky-600 font-semibold hover:text-sky-700 transition-colors">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}