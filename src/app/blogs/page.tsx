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

    return <>
        <h1>Blogs</h1>
        <p>{status}</p>
        <div><Link href={'/blog/create'}>Create New Blog</Link></div>
        <ul>
            {blogs.map((blog, idx) => {
                return <li key={idx}><Link href={`/blog/read/${blog.id}`}>{blog.title}</Link></li>
            })}
        </ul>
    </>
}