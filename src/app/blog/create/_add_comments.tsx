'use client';

import { useRef, useState } from "react";
import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useAppSelector } from "@/redux/store";

export default function AddComment({ id }: { id: string }) {
    const supabase = getSupabaseBrowserClient();

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [comment, setComment] = useState('');
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

        const { error } = await supabase
            .from('comments')
            .insert({
                comment: comment,
                email: user?.email, blog_id: parseInt(id),
                image: selectedImage ?
                    `${user?.id}/${id}/comments/${selectedImage.name}` : null,
            })
            .select();

        if (error) {
            setStatus(error.message);
            return;
        }

        setComment('');
        setSelectedImage(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <div>
            <div className="glass-card flex flex-col gap-3">
                <h6>Add a comment</h6>
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
    )
}