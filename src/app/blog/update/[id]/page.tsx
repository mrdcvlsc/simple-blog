import supabase from "@/app/_lib/_supabase_client";
import Image from "next/image"

type Blog = {
    id: number;
    created_at: string;
    title: string;
    body: string;
    upvotes: number;
    downvotes: number;
};

export default async function ReadBlog({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const { data, error } = await supabase.from('blogs')
        .select('created_at, title, body, upvotes, downvotes')
        .eq('id', id).single();

    console.log('data = ', data);

    return <>
        <p>{(data) ? new Date(data.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
            : 'N/A'}</p>
        <h2>Title: {(data) ? data.title : 'N/A'}</h2>
        <p>{(data) ? data.body : 'N/A'}</p>
        <p><span>{(data) ? data.upvotes : 0}</span><span>{(data) ? data.downvotes : 0}</span></p>
        <Image src="/next.svg" alt="test-image" width={100} height={100} />
    </>
}