'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import type { BlogList } from '@/app/_lib/mytypes';

export default function ViewBlogs() {
    const supabase = getSupabaseBrowserClient();

    const [status, setStatus] = useState('');
    const [blogs, setBlogs] = useState<BlogList>([]);

    useEffect(() => {
        async function loadBlogs() {
            const response = await supabase
                .from('blogs')
                .select("id, title, created_at");

            if (response.error) {
                setStatus(`on page load: ${response.error.message}`);
                return;
            }

            console.log('blogs:');
            console.log(response.data);
            setBlogs(response.data);
        };

        loadBlogs();
    }, []);

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text mb-2">
                        Explore Blogs
                    </h1>
                    <p className="text-gray-600">Discover stories and ideas from our community</p>
                </div>
                <Link href={'/blog/create'} className="glass-button-primary text-base sm:text-lg whitespace-nowrap">
                    Create New Blog
                </Link>
            </div>

            {status && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                    {status}
                </div>
            )}

            {blogs.length === 0 ? (
                <div className="glass-card text-center py-12">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Blogs Yet</h2>
                    <p className="text-gray-600 mb-6">Be the first to share your thoughts in Droplet</p>
                    <Link href={'/blog/create'} className="glass-button-primary inline-flex">
                        Create First Blog
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog, idx) => {
                        const date = new Date(blog.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });

                        return (
                            <Link
                                key={idx}
                                href={`/blog/read/${blog.id}`}
                                className="glass-card group cursor-pointer h-full"
                            >
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-sky-600 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                        <span className="text-sm text-gray-500">{date}</span>
                                        <span className="text-sky-500 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    )
}