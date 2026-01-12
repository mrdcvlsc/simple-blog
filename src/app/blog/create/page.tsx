import Image from "next/image"
import supabase from "@/app/_lib/_supabase_server_client"

export default function Home() {
    return <>
        <h1>This is the blog CREATE page</h1>
        <Image src="/next.svg" alt="test-image" width={100} height={100} />
    </>
}