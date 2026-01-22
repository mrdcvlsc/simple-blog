'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import type { BlogList } from '@/app/_lib/mytypes';

export default function ViewBlogs() {
    const supabase = getSupabaseBrowserClient();

    const [status, setStatus] = useState('');
    const [blogs, setBlogs] = useState<BlogList>([]);

    const [page, setPage] = useState('0');
    const [pageSize, setPageSize] = useState('4');

    const paginationInputChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [pageInput, setPageInput] = useState('0');
    const [pageSizeInput, setPageSizeInput] = useState('4');

    useEffect(() => {
        loadBlogs(page, pageSize);

        return () => {
            if (paginationInputChangeTimerRef.current) {
                clearTimeout(paginationInputChangeTimerRef.current);
            }
        };
    }, []);


    const loadBlogs = async function (toPage: string, ofPageSize: string) {
        console.log(`load blog : page = ${toPage}, page size = ${ofPageSize}`);

        const to_page = parseInt(toPage);
        const of_page_size = parseInt(ofPageSize);

        if (to_page < 0) {
            setStatus('invalid page number');
            return;
        }

        if (of_page_size < 1 || of_page_size > 30 || isNaN(of_page_size)) {
            setStatus('invalid page size');
            return;
        }

        const response = await supabase
            .from('blogs')
            .select("id, title, created_at, owner_email")
            .order('created_at', { ascending: false })
            .range(to_page * of_page_size, (to_page + 1) * of_page_size - 1);

        if (response.error) {
            setStatus(`on page load: ${response.error.message}`);
            return;
        }

        setBlogs(response.data);
        setStatus('');
    };

    const handlePageChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
        setPageInput(e.target.value);

        if (paginationInputChangeTimerRef.current) {
            clearTimeout(paginationInputChangeTimerRef.current);
        }

        paginationInputChangeTimerRef.current = setTimeout(async () => {
            await loadBlogs(e.target.value, pageSize);
            setPage(e.target.value);
            setPageInput(e.target.value);
        }, 1000);
    }

    const handlePageSizeChange = async function (e: React.ChangeEvent<HTMLInputElement>) {
        setPageSizeInput(e.target.value);

        if (paginationInputChangeTimerRef.current) {
            clearTimeout(paginationInputChangeTimerRef.current);
        }

        paginationInputChangeTimerRef.current = setTimeout(async () => {
            await loadBlogs('0', e.target.value);
            setPage('0');
            setPageInput('0');
            setPageSize(e.target.value);
            setPageSizeInput(e.target.value);
        }, 1000);

    }

    const handlePageIncrement = async function () {
        await loadBlogs(`${parseInt(page) + 1}`, pageSize);
        setPage(`${parseInt(page) + 1}`);
        setPageInput(`${parseInt(page) + 1}`);
    }

    const handlePageDecrement = async function () {
        await loadBlogs(`${parseInt(page) - 1}`, pageSize);
        setPage(`${parseInt(page) - 1}`);
        setPageInput(`${parseInt(page) - 1}`);
    }

    return (
        <div className="w-full space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text mb-2">
                        Explore Blogs
                    </h1>
                    <p className="text-gray-600">Discover stories and ideas from our community</p>
                </div>
                <Link href={'/blog/create'} className="glass-button-primary text-base sm:text-lg whitespace-nowrap">
                    Create New Blog
                </Link>
            </div>

            {status && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                    {status}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog, idx) => {
                    const date = new Date(blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    });

                    return (
                        <Link
                            key={blog.id}
                            href={`/blog/read/${blog.id}`}
                            className="glass-card group cursor-pointer h-full"
                        >
                            <div className="space-y-0.5 flex flex-col justify-between h-full">
                                <div className=' h-full flex flex-col justify-between'>
                                    <h5 className=" text-xl font-bold text-gray-800 group-hover:text-sky-600 transition-colors line-clamp-2 mb-3">
                                        {blog.title}
                                    </h5>
                                    <p className=''>{blog?.owner_email ? blog.owner_email : null}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                    {/* <div className="flex items-center justify-between pt-4 border-t border-b-black"> */}
                                    <span className="text-sm text-gray-500">{date}</span>
                                    <span className="text-sky-500 group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="flex justify-center gap-4 h-full">
                <label>
                    Page : <input type='string' className="glass-input w-16" value={pageInput} onChange={handlePageChange} />
                </label>
                <button className="glass-button-secondary cursor-pointer hover:scale-105 font-extrabold" onClick={handlePageDecrement}>{'<'}</button>
                <button className="glass-button-secondary cursor-pointer hover:scale-105 font-extrabold" onClick={handlePageIncrement}>{'>'}</button>
                <label> Page Size :
                    <input type='string' className="glass-input w-16" value={pageSizeInput} onChange={handlePageSizeChange} />
                </label>
            </div>
        </div>
    )
}