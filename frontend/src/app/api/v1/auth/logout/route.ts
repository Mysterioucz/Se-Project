//@desc   Log user out / clear token
//@route  POST /api/v1/auth/logout

// import { protect } from "@/src/lib/authMiddleware";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

//@access Private
export async function POST(req: NextRequest) {
    // const protectedResponse = await protect(req);
    // if (protectedResponse?.status == 401) {
        // return protectedResponse;
    // }

    const cookieStore = await cookies();
    cookieStore.set("token", "", {
        expires: new Date(0),
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
