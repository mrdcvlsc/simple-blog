import Image from "next/image"

export default function Home() {
    return <>
        <h1>This is the blog wall page</h1>
        <Image src="/next.svg" alt="test-image" width={100} height={100} />
    </>
}