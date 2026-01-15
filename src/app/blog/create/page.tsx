'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/redux/store';

export default function CreateBlog() {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();

    const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);

    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        // async function checkIfUserIsLoggedInFirst() {
        //     const { data: { user }, error } = await supabase.auth.getUser();

        //     if (!user) {
        //         router.push('/auth/login');
        //         return;
        //     }
        // }

        // checkIfUserIsLoggedInFirst();

        if (!isAuth) {
            router.push('/auth/login');
        }
    }, []);

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

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text">
                    Create Your Blog
                </h1>
                <p className="text-gray-600">Share your thoughts with the world</p>
            </div>

            <form onSubmit={handlePostBlog} className="glass-card space-y-6">
                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Blog Title</label>
                    <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Enter an engaging title for your blog...'
                        className='glass-input text-lg'
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">Make it catchy and memorable</p>
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Content</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder='Write your thoughts, ideas, and stories here...'
                        className='glass-input min-h-80 resize-none text-base'
                        required
                    />
                    <p className="text-xs text-gray-500 mt-1">{body.length} characters</p>
                </div>

                {status && (
                    <div className={`p-4 rounded-lg border text-sm ${status.includes('already')
                            ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                            : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        {status}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                    <button type='submit' className='glass-button-primary flex-1 text-lg font-semibold'>
                        Publish Blog
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

            <div className="glass-card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Writing Tips</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                    <li>• Start with a compelling title that captures attention</li>
                    <li>• Write naturally and express your genuine thoughts</li>
                    <li>• Break up long content into paragraphs for readability</li>
                    <li>• Proofread before publishing</li>
                </ul>
            </div>
        </div>
    )
}