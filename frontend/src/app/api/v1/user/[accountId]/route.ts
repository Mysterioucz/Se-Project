import prisma from "@/db";
import { authorize } from "@/src/lib/authMiddleware";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { decode } from "punycode";

interface JwtPayload {
    AccountID: string;
    Email: string;
    FirstName: string;
    LastName: string;
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ accountId: string }> }
) {
    const protect = await authorize(req, ['User', 'Admin']);
    if (protect.status != 200) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authorized to this route'
            }),
            { status: 401 }
        );
    }

    const { accountId } = await params;
    const { updateFirstName, updateLastName } = await req.json();

    let token = req.headers.get("authorization")!.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (decoded.AccountID != accountId) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authorized to this route'
            }),
            { status: 401 }
        );
    }

    if (! updateFirstName && ! updateLastName) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Please provide at least one field to update (FirstName or LastName).",
            }),
            { status: 400 }
        );
    }

    try {
        const updatedUser = await prisma.account.update({
            where: { 
                AccountID: accountId 
            },
            data: {
                ...(updateFirstName && { FirstName: updateFirstName }), // Only update if provided
                ...(updateLastName && { LastName: updateLastName }),   // Only update if provided
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: updatedUser,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error",
            }),
            { status: 500 }
        );
    }
}
