//@desc   Log user out / clear token
//@route  POST /api/v1/auth/logout

import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";

//@access Private
export const logout = async (req: NextApiRequest, res: NextApiResponse) => {
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
};
