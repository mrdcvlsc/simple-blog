import Image from "next/image"
import Link from "next/link"

export default function Home() {
    return <>
        <h1>Hello, Next.js THIS IS THE LANDING PAGE!</h1>
        <Link href={'/login'}>Login</Link>
        <Link href={'/register'}>Register</Link>
        <Image src="/next.svg" alt="test-image" width={100} height={100} />
    </>
}