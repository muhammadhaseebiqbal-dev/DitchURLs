import { NextRequest, NextResponse } from "next/server"
import sql from "@/app/api/db/db"
import { redirect } from "next/navigation"
import isURLValid from "@/app/api/utils/urlvalidator"



export async function POST(
    req: NextRequest,
    { params }: {params: {short_code: string}}
){
    const { short_code } = await  params;
    const body = await req.json();
    const password = String(body?.password || "");

    console.log(password);
    console.log(short_code);

    // check the password
    const result = await sql`SELECT actual_url FROM links WHERE short_code = ${short_code} AND password = ${password} LIMIT 1;`
    if (result.length > 0) {
        if (isURLValid(result[0].actual_url)){
            return NextResponse.json({success: true, message: "Password matched!", actual_url: result[0].actual_url})
        } else{
            return NextResponse.json({success: false, message: "URL is not valid! from database"})
        }
    } else{
        return NextResponse.json({success: false, message: "Password is incorrect!"})
    }

}