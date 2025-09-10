import prisma from "@/db";
import { authorize } from "@/src/lib/authMiddleware";
import { NextRequest } from "next/server";

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
                FirstName: updateFirstName, 
                LastName: updateLastName 
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
