'use client';

import { getSupabaseBrowserClient } from '@/app/_lib/_supabase_browser_client';
import type { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useAppSelector } from '@/redux/store';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/redux/store';

import type { BlogList } from '@/app/_lib/mytypes';
import { logOut } from '@/redux/authslice';

export default function UserHomePage() {
    const router = useRouter();
    const supabase = getSupabaseBrowserClient();
    const isAuth = useAppSelector((state) => state.authReducer.value.isAuth);
    const authUser = useAppSelector((state) => state.authReducer.value.user);
    const dispatch = useDispatch<AppDispatch>();

    const [mounted, setMounted] = useState(false);

    const [status, setStatus] = useState('');
    const [userBlogs, setUserBlogs] = useState<BlogList>([]);

    const [publishedBlogs, setPublishedBlogs] = useState(0);

    const [page, setPage] = useState('0');
    const [pageSize, setPageSize] = useState('4');

    const paginationInputChangeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [pageInput, setPageInput] = useState('0');
    const [pageSizeInput, setPageSizeInput] = useState('4');

    useEffect(() => {
        setMounted(true);
        // async function authenticateUser() {
        //     const { data: { user }, error } = await supabase.auth.getUser();

        //     if (error) {
        //         console.log(error.message);
        //         router.push('/');
        //         return;
        //     } else {
        //         setUser(user);
        //     }

        //     const response = await supabase
        //         .from('blogs')
        //         .select("id, title, created_at")
        //         .eq('owner_id', user?.id);

        //     if (response.error) {
        //         setStatus(`on page load: ${response.error.message}`);
        //         return;
        //     }

        //     console.log('blogs:');
        //     console.log(response.data);
        //     setUserBlogs(response.data);
        // };

        // authenticateUser();


        /////////////////

        if (!isAuth) {
            router.push('/');
            return;
        }

        async function countUserBlogs() {
            if (!authUser) {
                setPublishedBlogs(0);
                return;
            }

            const { count, error: err_count } = await supabase
                .from('blogs')
                .select("owner_id", { count: 'exact', head: true })
                .eq('owner_id', authUser.id);

            if (err_count) {
                setStatus('unable to get the total blogs published by the user');
            }

            if (count) {
                console.log('got count =', count);
                setPublishedBlogs(count);
            } else {
                console.log('count is null for some reason');
            }
        }

        countUserBlogs();
        loadBlogs(page, pageSize);

        return () => {
            if (paginationInputChangeTimerRef.current) {
                clearTimeout(paginationInputChangeTimerRef.current);
            }
        };
    }, []);


    const loadBlogs = async function (toPage: string, ofPageSize: string) {
        if (!authUser) {
            setStatus(
                "there was a problem in the app, we detected that a user is logged" +
                "-in but the user data is not preset, please clear the browser" +
                "history, cache and cookies of this website and login again with" +
                "your account to possibly fix the issue."
            );
            return;
        }

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
            .select("id, title, created_at")
            .order('created_at', { ascending: false })
            .range(to_page * of_page_size, (to_page + 1) * of_page_size - 1)
            .eq('owner_id', authUser.id);

        if (response.error) {
            setStatus(`we're unable to load the user blog post, ${response.error.message}`);
            return;
        }

        console.log('blogs:');
        console.log(response.data);
        setUserBlogs(response.data);
        setStatus('');
    };

    const handleLogout = async function logoutUser() {
        let { error } = await supabase.auth.signOut();

        if (error) {
            setStatus(error.message);
            return;
        }

        dispatch(logOut());
        router.push('/');
    }

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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text">
                        Welcome, {mounted && authUser ? authUser.email?.split('@')[0] : 'Writer'}
                    </h1>
                    <p className="text-gray-600">{mounted && authUser ? authUser.email : ''}</p>
                </div>
                {mounted && isAuth ? (
                    <button
                        onClick={handleLogout}
                        className="glass-button-secondary text-base whitespace-nowrap"
                    >
                        Logout
                    </button>
                ) : null}
            </div>

            {status && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
                    {status}
                </div>
            )}

            <div className="glass-card border-2 border-dashed border-sky-400 text-center py-8 space-y-4">
                <h2 className="text-2xl font-bold text-gray-800">Ready to Share?</h2>
                <p className="text-gray-600">Start a new blog post and share your thoughts with the world</p>
                <Link href={'/blog/create'} className="glass-button-primary inline-flex text-lg">
                    Create New Blog
                </Link>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Blogs</h2>
                    <p className="text-gray-600">{publishedBlogs} {publishedBlogs === 1 ? 'blog' : 'blogs'} published</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userBlogs.map((blog, idx) => {
                        const date = new Date(blog.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });

                        return (
                            <div key={blog.id} className="glass-card group space-y-4">
                                <div className="flex items-start justify-between">
                                    <div></div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/blog/update/${blog.id}`}
                                            className="p-2 rounded-lg hover:bg-sky-50 transition-colors text-gray-600 hover:text-sky-600"
                                            title="Edit"
                                        >
                                            edit
                                        </Link>
                                        <Link
                                            href={`/blog/delete/${blog.id}`}
                                            className="p-2 rounded-lg hover:bg-red-50 transition-colors text-gray-600 hover:text-red-600"
                                            title="Delete"
                                        >
                                            delete
                                        </Link>
                                    </div>
                                </div>
                                <Link href={`/blog/read/${blog.id}`} className="block group">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-sky-600 transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                </Link>
                                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                    <span className="text-sm text-gray-500">{date}</span>
                                    <Link
                                        href={`/blog/read/${blog.id}`}
                                        className="text-sky-500 group-hover:translate-x-1 transition-transform"
                                    >
                                        →
                                    </Link>
                                </div>
                            </div>
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
        </div>
    )
}