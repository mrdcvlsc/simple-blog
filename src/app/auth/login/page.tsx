'use client';

import supabase from '@/app/_lib/_supabase_server_client';
import React, { useState } from 'react';

export default function Register() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypedPassword] = useState('');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();


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
            </div>
        </form>
    </>
}