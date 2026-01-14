'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useEffect, useState } from 'react';

export default function DeleteBlog({ params }: { params: Promise<{ id: string }> }) {
    const supabase = getSupabaseBrowserClient();

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');
    const [blogID, setBlogID] = useState('');
    const [ownerID, setOwnerID] = useState('');

    useEffect(() => {
        async function fetchBlog() {
            const { id } = await params;

            const response = await supabase.from('blogs')
                .select('id, created_at, title, body, upvotes, downvotes, owner_id')
                .eq('id', id).single();

            const data = response.data;
            const error = response.error;

            if (error) {
                setStatus("Opps! we didn't find that blog, it might have been deleted or is not existing yet");
                return;
            }

            setBlogID(id);
            setTitle(data?.title);
            setBody(data?.body);
            setOwnerID(data?.owner_id);
        }

        fetchBlog();
    }, []);

    async function handleDeleteBlog() {
        if (ownerID != (await supabase.auth.getUser()).data.user?.id) {
            setStatus("you're not allowed to delete this blog since you're not the owner or have the admin/mod privilege to do so");
            return;
        }

        const { error } = await supabase.from('blogs').delete().eq('id', blogID);

        if (error) {
            setStatus(error.message);
        }
    }

    return <>
        <h1>This is the blog DELETE page</h1>
        <h2>{title}</h2>
        <p>{body}</p>
        <p>{status}</p>
        <button type='button' onClick={handleDeleteBlog}>Delete Blog</button>
    </>
}