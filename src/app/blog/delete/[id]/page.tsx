'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/redux/store';

export default function DeleteBlog({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();
    const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);
    const authUser = useAppSelector((state) => state.authReducer.value.user);

    const [title, setTitle] = useState('');
    const [image, setImage] = useState<string | null>('');
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');
    const [ownerID, setOwnerID] = useState('');

    useEffect(() => {
        if (!isAuth) {
            router.push('/auth/login');
        }

        async function fetchBlog() {
            const { id } = await params;

            if (isNaN(parseInt(id))) {
                setStatus('invalid blog id detected, non-numeric characters detected');
                return;
            }

            if (Number(id) < 0) {
                setStatus('invalid blog id detected, negative blog id numbers does not exist');
                return;
            }

            const response = await supabase.from('blogs')
                .select()
                .eq('id', parseInt(id)).single();

            const data = response.data;
            const error = response.error;

            console.log('blog to delete data =', data);

            if (error) {
                setStatus("Opps! we didn't find that blog, it might have been deleted or is not existing yet");
                return;
            }

            if (data) {
                setTitle(data?.title);
                setImage(data?.image ? data.image : null);
                setBody(data?.body);
                setOwnerID(data?.owner_id);
            } else {
                setStatus('an error occur when fetching the blog data, please try again');
            }
        }

        fetchBlog();
    }, []);

    async function handleDeleteBlog() {
        if (ownerID != authUser?.id) {
            setStatus("you're not allowed to delete this blog since you're not the owner or have the admin/mod privilege to do so");
            return;
        }

        const { error } = await supabase.from('blogs').delete().eq('id', parseInt((await params).id));

        if (error) {
            setStatus(error.message);
            return;
        }

        console.log('blog to delete data image selected =', image);

        if (image) {
            const { data: img_data, error: error_delete_image } = await supabase
                .storage
                .from('uploaded_images')
                .remove([image]);

            if (error_delete_image) {
                setStatus(`blog deleted, but its associated image was not: ${error_delete_image.message}`);
                return;
            }
        }

        router.push('/user/home');
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-280px)] px-4">
            <div className="w-full max-w-md space-y-6">
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        <span className="text-4xl">!</span>
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-red-600">Delete Blog?</h1>
                    <p className="text-gray-600">This action cannot be undone.</p>
                </div>

                <div className="glass-card space-y-3">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Title</p>
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Preview</p>
                        <p className="text-gray-700 line-clamp-3">{body}</p>
                    </div>
                </div>

                {status && (
                    <div className={`p-4 rounded-lg border text-sm ${status.includes('not allowed')
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        : 'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        {status}
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        type='button'
                        onClick={handleDeleteBlog}
                        className='glass-button-primary flex-1 text-lg font-semibold bg-red-500 hover:bg-red-600'
                        disabled={!isAuth}
                    >
                        Delete
                    </button>
                    <button
                        type='button'
                        onClick={() => router.back()}
                        className='glass-button-secondary flex-1 text-lg font-semibold'
                    >
                        Cancel
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center">
                    Once deleted, this blog cannot be recovered.
                </p>
            </div>
        </div>
    )
}