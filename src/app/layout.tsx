import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ReduxProvider } from "@/redux/provider";
import NavigationBar from "./_nav";

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
                <ReduxProvider>
                    <NavigationBar />

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
                </ReduxProvider>
            </body>
        </html>
    )
}