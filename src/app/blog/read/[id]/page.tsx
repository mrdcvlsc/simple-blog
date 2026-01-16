import { createSupabaseServerClient } from "@/app/_lib/_supabase_server_client";
import Image from "next/image";
import Link from "next/link";

export default async function ReadBlog({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createSupabaseServerClient();
    const { id } = await params;
    const response = await supabase.from('blogs')
        .select()
        .eq('id', parseInt(id)).single();

    const data = response.data;
    const error = response.error;

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-280px)]">
                <div className="text-center glass-card max-w-md">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Blog Not Found</h1>
                    <p className="text-gray-600 mb-6">
                        We couldn't find that blog. It might have been deleted or doesn't exist yet.
                    </p>
                    <Link href="/blogs" className="glass-button-primary inline-flex">
                        Back to Blogs
                    </Link>
                </div>
            </div>
        )
    } else if (data && response.status < 300) {
        const date = new Date(data.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        return (
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-sm">{date}</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 leading-tight">
                        {data.title}
                    </h1>
                </div>

                {data.image ? <div className="glass-card space-y-6 flex justify-center align-middle h-3/4">
                    <Image alt="blog-image" width={300} height={100} src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploaded_images/${data.image}`} />
                </div> : null}

                <div className="glass-card space-y-6">
                    <div className="prose prose-sm sm:prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed text-base sm:text-lg">
                        {data.body}
                    </div>
                </div>

                <div className="glass-card">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-sky-600">{data.upvotes || 0}</div>
                                <div className="text-xs text-gray-600">👍 Upvotes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600">{data.downvotes || 0}</div>
                                <div className="text-xs text-gray-600">👎 Downvotes</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={`/blog/update/${id}`} className="glass-button-secondary flex-1 text-center">
                        Edit Blog
                    </Link>
                    <Link href={`/blog/delete/${id}`} className="glass-button-secondary flex-1 text-center bg-red-50 text-red-600 hover:bg-red-100">
                        Delete Blog
                    </Link>
                    <Link href="/blogs" className="glass-button-primary flex-1 text-center">
                        Explore Blogs
                    </Link>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-280px)]">
                <div className="text-center glass-card max-w-md">
                    <div className="text-5xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Something Went Wrong</h1>
                    <p className="text-gray-600 mb-6">
                        There was a problem retrieving the blog data. Please try again later.
                    </p>
                    <Link href="/blogs" className="glass-button-primary inline-flex">
                        Explore Blogs
                    </Link>
                </div>
            </div>
        )
    }
}