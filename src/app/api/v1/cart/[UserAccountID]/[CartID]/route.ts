import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";
import { ErrorMessages } from "@/src/enums/ErrorMessages";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ UserAccountID: string }> }
) {
    try {
        const { UserAccountID } = await params;

        const { searchParams } = new URL(req.url);
        const cartIds = searchParams.getAll("cartId").map(Number).filter(Boolean);
        console.log(cartIds);
        if (! UserAccountID) {
            return NextResponse.json({ 
                success: false, 
                message: ErrorMessages.MISSING_PARAMETER 
            }, { 
                status: 400 
            });
        }

        if (cartIds.length === 0) {
            return NextResponse.json({ 
                success: false, 
                message: ErrorMessages.MISSING_PARAMETER 
            }, { 
                status: 400 
            });
        }

        const result = await prisma.cart.findMany({
            where: {
                UserAccountID: UserAccountID,
                ID: { in: cartIds },
            },
            select: {
                FlightType: true,
                ClassType: true,
                Adults: true,
                Childrens: true,
                Infants: true,
                Price: true,
                DepartFlight: true,
                ReturnFlight: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.SERVER,
            }),
            { status: 500 }
        );
    }
}