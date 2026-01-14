import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Droplet - Minimal Blogging Platform",
    description: "Drop your thoughts like water droplets. A minimal blogging platform.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="flex flex-col min-h-screen bg-linear-to-br from-blue-50 via-cyan-50 to-blue-100">
                {/* -------------- navigation bar -------------- */}
                <header className="sticky top-0 z-50 glass-effect border-b border-white/30">
                    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-sky-400 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-transform duration-200 text-white text-sm sm:text-base font-bold">
                                    ◆
                                </div>
                                <span className="font-bold text-lg sm:text-2xl bg-linear-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent hidden sm:inline">Droplet</span>
                            </Link>
                            <div className="hidden md:flex items-center gap-6">
                                <Link href="/user/home" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">
                                    Home
                                </Link>
                                <Link href="/blogs" className="text-gray-700 hover:text-sky-600 font-medium transition-colors">
                                    Explore
                                </Link>
                                <Link href="/auth/login" className="glass-button-secondary text-sm">
                                    Sign In
                                </Link>
                                <Link href="/auth/register" className="glass-button-primary text-sm">
                                    Get Started
                                </Link>
                            </div>
                            <div className="md:hidden flex items-center gap-2">
                                <Link href="/auth/login" className="glass-button-secondary text-xs px-3 py-2">
                                    Sign In
                                </Link>
                            </div>
                        </div>
                    </nav>
                </header>

                {/* -------------- page content -------------- */}
                <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </main>

                {/* -------------- footer -------------- */}
                <footer className="mt-12 glass-effect border-t border-white/30 m-4 sm:m-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
                                <div className="flex gap-2">
                                    <Link href="/blogs" className="text-gray-600 hover:text-sky-600 text-sm transition-colors">Explore Blogs</Link>
                                    <span>•</span>
                                    <Link href="/auth/login" className="text-gray-600 hover:text-sky-600 text-sm transition-colors">Sign In</Link>
                                    <span>•</span>
                                    <Link href="/auth/register" className="text-gray-600 hover:text-sky-600 text-sm transition-colors">Create Account</Link>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">◆</span>
                                    <span className="font-bold text-lg text-sky-600">Droplet</span>
                                </div>
                                <p className="text-gray-600 text-sm">Share your small ideas and stories.</p>
                            </div>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    )
}