'use client';

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useAppSelector } from "@/redux/store";

import type { Database } from "@/app/_lib/database.types";
import Image from "next/image";
type CommentRow = Database['public']['Tables']['comments']['Row'];

export default function ShowComments({ id }: { id: string }) {
    const supabase = getSupabaseBrowserClient();

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [comment, setComment] = useState('');
    const [blogComments, setBlogComments] = useState<CommentRow[]>([]);
    const [status, setStatus] = useState('');

    const handleAddComment = async function () {
        const { data: { user }, error: error_get_user } = await supabase.auth.getUser();

        if (error_get_user) {
            setStatus(error_get_user.message);
            return;
        }

        if (selectedImage && user) {
            const { data, error } = await supabase
                .storage
                .from('uploaded_images')
                .upload(`${user?.id}/${id}/comments/${selectedImage.name}`, selectedImage, {
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

        const { data: new_comment, error } = await supabase
            .from('comments')
            .insert({
                comment: comment,
                email: user?.email, blog_id: parseInt(id),
                image: selectedImage ?
                    `${user?.id}/${id}/comments/${selectedImage.name}` : null,
            })
            .select()
            .eq('blog_id', parseInt(id))
            .order('created_at', { ascending: false })
            .range(0, 0);

        if (error) {
            setStatus(error.message);
            return;
        }

        const new_blog_comments = new_comment.concat(blogComments);
        setBlogComments(new_blog_comments);
        setComment('');
        setSelectedImage(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleLoadComments = async function () {
        const max_comment_to_load = 2;

        let { data: fetched_comments, error } = await supabase
            .from('comments')
            .select()
            .eq('blog_id', parseInt(id))
            .order('created_at', { ascending: false })
            .range(blogComments.length, blogComments.length + max_comment_to_load - 1);

        if (error) {
            setStatus(error.message);
        }

        if (fetched_comments) {
            const new_comments = blogComments.concat(fetched_comments);
            setBlogComments(new_comments);
        }
    }

    useEffect(() => {
        handleLoadComments();
    }, []);

    return (
        <>
            {status && <div className="glass-card border-red-500 text-red-500">{status}</div>}
            <div className="flex flex-col gap-2">
                {blogComments.map((comment, idx) => {
                    const date = new Date(comment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    return (
                        <div className="glass-card flex flex-col gap-2" key={comment.id}>
                            <div className="border-b-blue-800"><p className="font-bold">{comment.email}</p></div>
                            <p className="font-light">{comment.comment}</p>
                            {comment.image ? <div className="space-y-6 flex justify-center align-middle h-3/4">
                                <Image alt="blog-image" width={300} height={100} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploaded_images/${comment.image}`} />
                            </div> : null}
                        </div>
                    )
                })}

                {blogComments?.length === 0 ?
                    <p>Be the first one to comment</p>
                    :
                    <button onClick={handleLoadComments} className="glass-button-secondary hover:scale-105 hover:border-amber-200 cursor-pointer w-full">Load More Comments</button>
                }
            </div>


            <div>
                <div className="glass-card flex flex-col gap-3">
                    <h6>Add a comment</h6>
                    {status && <div className="border-red-500 text-red-500">{status}</div>}
                    <input className="glass-input border-blue-300" type="text" value={comment} onChange={(e) => setComment(e.target.value)} />

                    <div className="w-full">
                        {selectedImage && (
                            <div className='flex flex-col justify-center items-center gap-2'>
                                <img
                                    alt="not found"
                                    width={"300px"}
                                    src={URL.createObjectURL(selectedImage)}
                                />
                                <button className='glass-button-secondary w-full cursor-pointer border-x-blue-400 border-t-blue-400 hover:border-amber-300 hover:font-bold rounded-b-none' onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                    setSelectedImage(null)
                                }}>Remove Image</button>
                            </div>
                        )}

                        <p hidden={selectedImage ? true : false}><i>you can also attach an image in your comment</i></p>
                        <input
                            hidden={selectedImage ? true : false}
                            className='glass-button-secondary w-full cursor-pointer border-x-blue-400 border-t-blue-400 hover:border-amber-300 hover:font-bold rounded-b-none'
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
                            placeholder="Attach Image"
                        />
                        <button className="glass-button-primary cursor-pointer w-full rounded-t-none" onClick={handleAddComment}>Post Comment</button>
                    </div>
                </div>
            </div>
        </>
    )
}