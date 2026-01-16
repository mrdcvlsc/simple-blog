'use client';

import { useRef, useState } from "react";
import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useAppSelector } from "@/redux/store";

import type { Database } from "@/app/_lib/database.types";
import Image from "next/image";
type CommentRow = Database['public']['Tables']['comments']['Row'];

export default function ShowComments({ id }: { id: string }) {
    const supabase = getSupabaseBrowserClient();

    const [comments, setComments] = useState<CommentRow[]>([]);
    const [status, setStatus] = useState('');

    const handleViewComments = async function () {
        let { data: comments, error } = await supabase
            .from('comments')
            .select()
            .order('created_at', { ascending: false })
            .eq('blog_id', parseInt(id));

        if (error) {
            setStatus(error.message);
        }

        if (comments) {
            setComments(comments);
        }
    }

    return (
        <>
            {comments?.length > 0 ?
                <button onClick={() => setComments([])} className="glass-button-secondary hover:scale-105 hover:border-amber-200 cursor-pointer w-full">Hide Comments</button>
                :
                <button onClick={handleViewComments} className="glass-button-secondary hover:scale-105 hover:border-amber-200 cursor-pointer w-full">Load/Refresh Comments</button>
            }
            {status && <div className="glass-card border-red-500 text-red-500">{status}</div>}
            <div className="flex flex-col gap-2">
                {comments.map((comment, idx) => {
                    const date = new Date(comment.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });

                    return (
                        <div className="glass-card flex flex-col gap-2" key={idx}>
                            <div className="border-b-blue-800"><p className="font-bold">{comment.email}</p></div>
                            <p className="font-light">{comment.comment}</p>
                            {comment.image ? <div className="space-y-6 flex justify-center align-middle h-3/4">
                                <Image alt="blog-image" width={300} height={100} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploaded_images/${comment.image}`} />
                            </div> : null}
                        </div>
                    )
                })}
            </div>
        </>
    )
}