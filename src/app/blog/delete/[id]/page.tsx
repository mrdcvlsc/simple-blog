'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useEffect, useState } from 'react';

export default function DeleteBlog({ params }: { params: Promise<{ id: string }> }) {
    const supabase = getSupabaseBrowserClient();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');
    const [blogID, setBlogID] = useState('');

    useEffect(() => {
        async function fetchBlog() {
            const { id } = await params;

            const response = await supabase.from('blogs')
                .select('id, created_at, title, body, upvotes, downvotes')
                .eq('id', id).single();

            const data = response.data;
            const error = response.error;

            setBlogID(id);
            setTitle(data?.title);
            setBody(data?.body);
        }

        fetchBlog();
    }, []);

    async function handleDeleteBlog(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        if (!title && !body) {
            setStatus('don\'t leave the title and the body of the blog empty');
            return;
        }

        const { error } = await supabase.from('blogs')
            .delete().eq('id', blogID).select();
    }

    return <>
        <h1>This is the blog DELETE page</h1>
        <h2>{title}</h2>
        <p>{body}</p>
        <button type='button' onClick={(e) => handleDeleteBlog(e)}>Delete Blog</button>
    </>
}