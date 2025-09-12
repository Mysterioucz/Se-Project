import prisma from "@/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

//@desc     Login
//@route    POST /api/v1/auth/login
//@access   Public
async function POST(req: NextRequest) {
    const { Email, Password } = await req.json();

    if (!Email || !Password) {
        return new Response(
            JSON.stringify({
                success: false,
                message: `Please provide all require parameters`,
            }),
            { status: 400 }
        );
    }

    try {
        const account = await prisma.account.findUnique({
            where: {
                Email: Email,
            },
        });

        if (!account) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `User not found`,
                }),
                { status: 404 }
            );
        }

        const isMatch = await bcrypt.compare(Password, account.Password);

        if (!isMatch) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `Invalid credentials`,
                }),
                { status: 401 }
            );
        }

        const payload = {
            AccountID: account.AccountID,
            Email: account.Email,
            FirstName: account.FirstName,
            LastName: account.LastName,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: "24h", // changable
        });

        const options: { expires: Date; httpOnly: boolean } = {
            expires: new Date(
                Date.now() +
                    Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
            ), // Cookie expiration time
            httpOnly: true, // Ensures cookie is not accessible via JavaScript
        };

        const cookieStore = await cookies();
        cookieStore.set("token", token, options);

        return new Response(
            JSON.stringify({
                success: true,
                AccountID: account.AccountID,
                FirstName: account.FirstName,
                LastName: account.LastName,
                token: token,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Server Error",
            }),
            { status: 500 }
        );
    }
}

// export { POST }; // This API is deprecated since we are using NextAuth.js for authentication
