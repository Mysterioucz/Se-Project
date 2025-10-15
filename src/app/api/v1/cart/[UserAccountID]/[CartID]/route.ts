import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";

export async function DELETE(
    req: NextRequest,
 { params }: { params: { UserAccountID: string; CartID: string } }
) {
    const { UserAccountID, CartID } = params;

    // If accountId doesn't match the token sent's ID
    const session = await getServerSession(nextAuthOptions);
    if (session?.user?.id != UserAccountID) {
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.PERMISSION,
            }),
            { status: 401 }
        );
    }

    try {
        const deletedCart = await prisma.cart.deleteMany({
        where: {
            UserAccountID,
            ID: Number(CartID),
        },
    });

    if (deletedCart.count === 0) {
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.NOT_FOUND,
            }),
            { status: 404 }
        );
    }

    return new Response(
        JSON.stringify({
            success: true,
        }),
        { status: 200 }
    );

    } catch (error) {
        console.log(error)
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.SERVER,
            }),
            { status: 500 }
        );
    }
}
