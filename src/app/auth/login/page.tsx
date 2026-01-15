'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { logIn } from '@/redux/authslice';
import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/redux/store';

export default function Login() {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();
    const dispatch = useDispatch<AppDispatch>();
    const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        // async function getAuthenticatedUser() {
        //     const { data: { user }, error } = await supabase.auth.getUser();

        //     if (!error && user) {
        //         dispatch(logIn(user));
        //         router.push('/user/home');
        //     }
        // }

        // getAuthenticatedUser();

        if (isAuth) {
            router.push('/user/home');
        }
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        let { data: { user }, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setStatus(error.message);
            return;
        }

        if (user) {
            dispatch(logIn(user));
            router.push('/user/home');
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-280px)] px-4 sm:px-0">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">Sign in to your account</p>
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
                            placeholder='********'
                            className='glass-input'
                            required
                        />
                    </div>

                    {status && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            {status}
                        </div>
                    )}

                    <button type='submit' className='glass-button-primary w-full text-lg font-semibold'>
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600">
                    Don't have an account?{' '}
                    <a href='/auth/register' className="text-sky-600 font-semibold hover:text-sky-700 transition-colors">
                        Create one
                    </a>
                </p>
            </div>
        </div>
    )
}