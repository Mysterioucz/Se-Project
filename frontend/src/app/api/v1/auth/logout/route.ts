//@desc   Log user out / clear token
//@route  POST /api/v1/auth/logout

import { cookies } from "next/headers";
import { NextRequest } from "next/server";

//@access Private
export async function POST(req: NextRequest) {
    const cookieStore = await cookies();
    cookieStore.set("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });

    return new Response(
        JSON.stringify({
            success: true,
            data: {},
        }),
        { status: 200 }
    );
}
