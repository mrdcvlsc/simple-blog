import Link from "next/link"

export default function LandingPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-280px)]">
            <div className="w-full max-w-3xl mx-auto text-center space-y-8 px-4 sm:px-0">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-r from-sky-400 to-cyan-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-linear-to-br from-sky-300 to-cyan-400 flex items-center justify-center shadow-2xl">
                            <span className="text-5xl sm:text-6xl">💧</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-linear-to-r from-sky-600 via-cyan-600 to-teal-600 bg-clip-text leading-tight">
                        Welcome to Droplet
                    </h1>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl text-gray-700 font-light">
                        Where your thoughts flow freely
                    </h2>
                </div>

                {/* Description */}
                <div className="glass-card max-w-2xl mx-auto">
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                        Share your thoughts, ideas, and stories with the world. Droplet is a minimal blogging platform designed for writers who value simplicity. Post small articles, express yourself, and connect with a other writers via blog posting and reading.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Link href="/blogs" className="glass-button-primary text-base sm:text-lg">
                        Explore Blogs
                    </Link>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                        <Link href="/auth/login" className="glass-button-secondary text-base sm:text-lg">
                            Sign-In
                        </Link>
                        <Link href="/auth/register" className="glass-button-primary text-base sm:text-lg">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}