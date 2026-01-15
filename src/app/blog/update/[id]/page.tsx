'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/redux/store';

export default function UpdateBlog({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();
    const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);
    const authUser = useAppSelector((state) => state.authReducer.value.user);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');
    const [ownerID, setOwnerID] = useState('');

    useEffect(() => {
        if (!isAuth) {
            router.push('/auth/login');
        }

        async function fetchBlog() {
            const { id } = await params;

            if (!Number.isInteger(id)) {
                setStatus('invalid blog id detected, non-numeric characters detected');
                return;
            }

            if (Number(id) < 0) {
                setStatus('invalid blog id detected, negative blog id numbers does not exist');
                return;
            }

            const response = await supabase.from('blogs')
                .select('id, owner_id, created_at, title, body, upvotes, downvotes')
                .eq('id', parseInt(id)).single();

            const data = response.data;
            const error = response.error;

            if (error) {
                setStatus("Opps! we didn't find that blog, it might have been deleted or is not existing yet");
                return;
            }

            if (data) {
                setTitle(data?.title);
                setBody(data?.body);
                setOwnerID(data?.owner_id);
            } else {
                setStatus('an error occur when fetching the blog data, please try again');
            }
        }

        fetchBlog();
    }, []);

    async function handleUpdateBlog(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (ownerID != authUser?.id) {
            setStatus("you're not allowed to delete this blog since you're not the owner or have the admin/mod privilege to do so");
            return;
        }

        const { error } = await supabase.from('blogs').update({
            title: title,
            body: body,
        }).eq('id', parseInt((await params).id)).select();

        if (error) {
            setStatus(error.message);
            return;
        }

        router.push(`/blog/read/${parseInt((await params).id)}`);
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text">
                    Edit Your Blog
                </h1>
                <p className="text-gray-600">Update your thoughts and ideas</p>
            </div>

            <form onSubmit={handleUpdateBlog} className="glass-card space-y-6">
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Blog Title</label>
                    <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Enter your blog title...'
                        className='glass-input text-lg'
                        required
                    />
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Content</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder='Update your content...'
                        className='glass-input min-h-80 resize-none text-base'
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">{body.length} characters</p>
                </div>

                {status && (
                    <div className={`p-4 rounded-lg border text-sm ${status.includes('not allowed')
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        {status}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <button type='submit' className='glass-button-primary flex-1 text-lg font-semibold'>
                        Save Changes
                    </button>
                    <button
                        type='button'
                        onClick={() => router.back()}
                        className='glass-button-secondary flex-1 text-lg font-semibold'
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}