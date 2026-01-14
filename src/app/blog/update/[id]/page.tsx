'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useEffect, useState } from 'react';

export default function UpdateBlog({ params }: { params: Promise<{ id: string }> }) {
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
                .select('id, created_at, title, body, upvotes, downvotes')
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

    async function handleUpdateBlog(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (ownerID != (await supabase.auth.getUser()).data.user?.id) {
            setStatus("you're not allowed to update this blog since you're not the owner or have the admin/mod privilege to do so");
            return;
        }

        const { error } = await supabase.from('blogs').update({
            title: title,
            body: body,
        }).eq('id', blogID).select();

        if (error) {
            setStatus(error.message);
        }
    }

    return <>
        <h1>This is the blog UPDATE page</h1>
        <form onSubmit={handleUpdateBlog}>
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

            <button type='submit'>Update Blog</button>
        </form>
    </>
}