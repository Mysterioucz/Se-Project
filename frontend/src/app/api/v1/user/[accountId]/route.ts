import prisma from "@/db";
// import { authorize, protect } from "@/src/lib/authMiddleware";
import { NextRequest } from "next/server";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ accountId: string }> }
) {
    // const protectedTokenResponse = await protect(req);
    // if (protectedTokenResponse?.status == 401) {
      // return protectedTokenResponse;
    // }

    const { accountId } = await params;
    const { FirstName, LastName } = await req.json();

    if (!FirstName && !LastName) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "Please provide at least one field to update (FirstName or LastName).",
            }),
            { status: 400 }
        );
    }

    try {
        const updatedUser = await prisma.account.update({
            where: { AccountID: accountId },
            data: { FirstName, LastName },
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
