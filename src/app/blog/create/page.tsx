'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateBlog() {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');

    async function handlePostBlog(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!title && !body) {
            setStatus('don\'t leave the title and the body of the blog empty');
            return;
        }

        const { error, data } = await supabase.from('blogs').insert({
            title: title,
            body: body,
        }).select();

        console.log('insert data =', data);

        if (error?.code === '23505') {
            setStatus('that title is already taken by a another blog post, please think of a different blog post title');
        } else if (error) {
            setStatus(error.message);
        } else {
            router.push(`/blog/read/${data[0].id}`);
        }
    }

    return <>
        <h1>This is the blog CREATE page</h1>
        <form onSubmit={handlePostBlog}>
            <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Blog Title'
                required
            />

            <input
                type='text'
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='Content Body'
                required
            />

            <p>{status}</p>

            <button type='submit'>Post Blog</button>
        </form>
    </>
}