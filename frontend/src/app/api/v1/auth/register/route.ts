import prisma from "@/db";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

//@desc     Register account
//@route    POST /api/v1/auth/register
//@access   Public
export async function POST(req: NextRequest) {
    const { AccountID, Email, Password, FirstName, LastName } = await req.json();
    if (!AccountID || !Password || !FirstName || !LastName) {
        return new Response(
            JSON.stringify({ error: "Please provide all required parameters" }),
            { status: 400 }
        );
    }
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = await prisma.account.create({
            data: {
                AccountID,
                Email,
                Password: hashedPassword,
                FirstName,
                LastName,
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: newUser,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                message: "Error",
            }),
            { status: 500 }
        );
    }
}
