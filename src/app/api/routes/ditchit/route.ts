import sql from "../../db/db";
import generate_short_code from "../../utils/short_code";
import calculate_expiry from "../../utils/expiry";
import { NextResponse, NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const body = await req.json()

    if (!body.actual_url) {
        return NextResponse.json({ success: "false", message: "actual url is required!" })
    }

    // Payload
    const actual_url = body.actual_url
    const short_code = !body.short_code ? generate_short_code() : body.short_code
    const expire_at = calculate_expiry(body.expire_at) ?? null
    const password = !body.password ? null : body.password

    console.log("Now i: ", new Date().toUTCString())
    console.log("ex i: ", expire_at ? new Date(expire_at).toUTCString() : "No expiry date")

     try {
        const result = await sql`SELECT expire_at FROM links WHERE short_code = ${short_code}`
        
        if (result.length > 0)
        {
            console.log("magaing expired!")
            if(result[0].expire_at && new Date(result[0].expire_at) < new Date())
            {
                await sql`DELETE FROM links WHERE short_code = ${short_code}`
                console.log("deleted")
            }
        }
        
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as Error).message }, {status: 500});
    }
    
    try {
        const existing = await sql`SELECT 1 FROM links WHERE short_code = ${short_code} LIMIT 1;`
        if (existing.length > 0) {
            return NextResponse.json({ success: false, message: "Alias already exists!" })
        }
    } catch (e) {
        return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
    }

   


    try {
        await sql`INSERT INTO links (actual_url, short_code, expire_at, password) VALUES (${actual_url}, ${short_code}, ${expire_at}, ${password});`;
        console.log("Inserted");
        return NextResponse.json({ success: true, message: "URL ditched successfully!", short_code: short_code });
    } catch (e) {
        console.log(e);
        return NextResponse.json({ success: false, error: (e as Error).message }, { status: 500 });
    }

}