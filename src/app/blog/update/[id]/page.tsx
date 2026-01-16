'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/redux/store';
import Image from 'next/image';

export default function UpdateBlog({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();
    const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);
    const authUser = useAppSelector((state) => state.authReducer.value.user);

    const [title, setTitle] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [body, setBody] = useState('');
    const [status, setStatus] = useState('');
    const [ownerID, setOwnerID] = useState('');

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

            if (error) {
                setStatus("Opps! we didn't find that blog, it might have been deleted or is not existing yet");
                return;
            }

            if (data) {
                setTitle(data?.title);
                setImage(data?.image);
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

        if (selectedImage) {
            const { data, error } = await supabase
                .storage
                .from('uploaded_images')
                .upload(`${authUser.id}/${selectedImage.name}`, selectedImage, {
                    cacheControl: '3600',
                    upsert: false
                });

            console.log('    data.path :', data?.path);
            console.log('data.id :', data?.id);
            console.log('data.fullPath :', data?.fullPath);

            if (error) {
                console.log('error uploading image :', error.message);
                setStatus(error.message);
            }
        }

        const { error } = await supabase.from('blogs').update({
            title: title,
            body: body,
            image: selectedImage ? `${authUser.id}/${selectedImage.name}` : null,
        }).eq('id', parseInt((await params).id)).select();

        if (error) {
            setStatus(error.message);
            return;
        }

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

                {image ? <>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Old Image</label>
                    <div className="flex justify-center align-middle">
                        <Image alt="blog-image" width={300} height={100} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploaded_images/${image}`} />
                    </div></> : null}

                <div className='flex flex-col gap-2'>
                    <label className="block text-lg font-semibold text-gray-800 mb-2">Upload Image</label>
                    {selectedImage && (
                        <div className='flex flex-col justify-center items-center gap-2'>
                            <img
                                alt="not found"
                                width={"250px"}
                                src={URL.createObjectURL(selectedImage)}
                            />
                            <button className='glass-button-primary cursor-pointer' onClick={() => {
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                                setSelectedImage(null)
                            }}>Remove Image</button>
                        </div>
                    )}

                    <input
                        hidden={selectedImage ? true : false}
                        className='glass-button-primary cursor-pointer w-full'
                        type="file"
                        name="myImage"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(event) => {
                            if (event.target.files) {
                                console.log(event.target.files[0]);
                                setSelectedImage(event.target.files[0]);
                            }
                        }}
                    />
                    <p className="text-xs text-gray-500 mt-1">Upload beautiful image</p>
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