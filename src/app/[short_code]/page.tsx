import { notFound, redirect } from "next/navigation";
import sql from "../api/db/db";

type Props = { params: { short_code: string } }

export default async function Page({ params }: Props) {
    const { short_code } = await params

    const result = await sql`SELECT actual_url, expire_at, password FROM links WHERE short_code = ${short_code}`
    if (!result || result.length === 0) {
        return notFound()
    }

    const { actual_url, expire_at, password } = result[0]

    console.log(expire_at)

    if (expire_at && new Date(expire_at) < new Date()) {
        console.log("ISO system: ",  new Date().toUTCString());
        console.log("ISO DB: ", expire_at);
        
        await sql`DELETE FROM links WHERE short_code = ${short_code}`;
        redirect(`/${short_code}/expired`)
    }

    if (password) {
        redirect(`/${short_code}/password?short_code=${short_code}`)
    }

    redirect(actual_url)
}