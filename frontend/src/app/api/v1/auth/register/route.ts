import prisma from "@/db";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

//@desc     Register account
//@route    POST /api/v1/auth/register
//@access   Public
export async function POST(req: NextRequest) {
    const { Email, Password, FirstName, LastName } = await req.json();
    if (!Password || !FirstName || !LastName || !Email) {
        return new Response(
            JSON.stringify({ error: "Please provide all required parameters" }),
            { status: 400 }
        );
    }
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newAccount = await prisma.account.create({
            data: {
                Email,
                Password: hashedPassword,
                FirstName,
                LastName,
            },
        });
        
        const accountID = newAccount?.AccountID;
        const addUser = await prisma.user.create({
            data: {
                UserAccountID: accountID,
            }
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: newAccount,
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
