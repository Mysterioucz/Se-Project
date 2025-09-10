import { authorize } from "@/src/lib/authMiddleware";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

//@desc     Log user out / clear token
//@route    POST /api/v1/auth/logout
//@access   Private
export async function POST(req: NextRequest) {
    const protect = await authorize(req, ['Admin', 'User']);
    if (protect.status == 200) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authorized to this route'
            }),
            { status: 401 }
        );
    }

    // disable cookie
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
