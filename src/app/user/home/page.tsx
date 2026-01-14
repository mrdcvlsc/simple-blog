'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type BlogListItem = {
    id: number;
    title: string;
    created_at: string;
}

type BlogList = BlogListItem[];

export default function UserHomePage() {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();

    const [user, setUser] = useState<User | null>(null);
    const [status, setStatus] = useState('');
    const [userBlogs, setUserBlogs] = useState<BlogList>([]);

    useEffect(() => {
        async function authenticateUser() {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error) {
                console.log(error.message);
                router.push('/');
                return;
            } else {
                setUser(user);
            }

            const response = await supabase
                .from('blogs')
                .select("id, title, created_at")
                .eq('owner_id', user?.id);

            if (response.error) {
                setStatus(`on page load: ${response.error.message}`);
                return;
            }

            console.log('blogs:');
            console.log(response.data);
            setUserBlogs(response.data);
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
        <button onClick={handleLogout}>Logout</button>
        <div><Link href={'/blog/create'}>Create New Blog</Link></div>
        <h3>Your Blogs</h3>
        <ul>
            {userBlogs.map((blog, idx) => {
                return <li key={idx}><Link href={`/blog/read/${blog.id}`}>{blog.title}</Link></li>
            })}
        </ul>
    </>
}