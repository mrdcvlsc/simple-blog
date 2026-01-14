import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
    return <>
        <h1>Welcome to Droplet,</h1>
        <h2>where you can let your thoughts drop</h2>
        <p>This is a simple demo, text-only, blogging website, where you can post random thoughts, rant, or things as long as it is not illegal.</p>
        <div className="border-2 border-red-500 w-[10em] flex justify-center items-center gap-4">
            <div><Link href={'/auth/login'}>Login</Link></div>
            <div><Link href={'/auth/register'}>Register</Link></div>
        </div>
    </>
}