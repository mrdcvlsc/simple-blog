import { createSupabaseServerClient } from "@/app/_lib/_supabase_server_client";

// type Blog = {
//     id: number;
//     created_at: string;
//     title: string;
//     body: string;
//     upvotes: number;
//     downvotes: number;
// };

export default async function ReadBlog({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createSupabaseServerClient();
    const { id } = await params;
    const response = await supabase.from('blogs')
        .select('created_at, title, body, upvotes, downvotes')
        .eq('id', id).single();

    const data = response.data;
    const error = response.error;

    // console.log('response =', response);
    // console.log('data  = ', data);
    // console.log('error = ', error);

    if (error) {
        return <>
            <p>Opps! we didn't find that blog, it might have been deleted or is not existing yet</p>
        </>
    } else if (data && response.status < 300) {
        return <>
            <p>{new Date(data.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}</p>

            <h2>Title: {data.title}</h2>
            <p>{data.body}</p>
            <p>
                <span>{data.upvotes}</span>
                <span>{data.downvotes}</span>
            </p>
        </>
    } else {
        return <>
            <p>There is a problem retrieving the data</p>
        </>
    }
}