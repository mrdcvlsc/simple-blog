'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/redux/store';

export default function NavigationBar() {
    const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const showAuthLinks = mounted ? isAuth : false;

    return (
        <header className="sticky top-0 z-50 glass-effect border-b border-white/30">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-transform duration-200 text-white text-sm sm:text-base font-bold">
                            ◆
                        </div>
                        <span className="font-bold text-lg sm:text-2xl bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent hidden sm:inline">Droplet</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        {showAuthLinks ? <Link href="/user/home" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">
                            Home
                        </Link> : null}
                        <Link href="/blogs" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">
                            Explore
                        </Link>
                        {showAuthLinks ? null : <Link href="/auth/login" className="glass-button-secondary text-sm">
                            Sign In
                        </Link>}
                        {showAuthLinks ? null : <Link href="/auth/register" className="glass-button-primary text-sm">
                            Get Started
                        </Link>}
                    </div>

                    {showAuthLinks ? null : <div className="md:hidden flex items-center gap-2">
                        <Link href="/auth/login" className="glass-button-secondary text-xs px-3 py-2">
                            Sign In
                        </Link>
                    </div>}
                </div>
            </nav>
        </header>
    )
}