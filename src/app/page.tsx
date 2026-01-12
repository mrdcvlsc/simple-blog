import Image from "next/image"

export default function Home() {
    return <>
        <h1>Hello, Next.js THIS IS THE LANDING PAGE!</h1>
        <Image src="/next.svg" alt="test-image" width={100} height={100} />
    </>
}