import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/cart/{UserAccountID}/{CartID}:
 *   get:
 *     summary: Get specific cart items
 *     description: Retrieve specific cart items by cart IDs for a user
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: UserAccountID
 *         in: path
 *         description: User account ID
 *         required: true
 *         schema:
 *           type: string
 *       - name: CartID
 *         in: path
 *         description: Cart ID (not used, use query param instead)
 *         required: true
 *         schema:
 *           type: string
 *       - name: cartId
 *         in: query
 *         description: Cart IDs to retrieve (can specify multiple)
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: integer
 *         style: form
 *         explode: true
 *         example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Successfully retrieved cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       FlightType:
 *                         type: string
 *                       ClassType:
 *                         type: string
 *                       Adults:
 *                         type: integer
 *                       Childrens:
 *                         type: integer
 *                       Infants:
 *                         type: integer
 *                       Price:
 *                         type: number
 *                       DepartFlight:
 *                         type: object
 *                       ReturnFlight:
 *                         type: object
 *                         nullable: true
 *             example:
 *               success: true
 *               data:
 *                 - id: 1
 *                   FlightType: "Round Trip"
 *                   ClassType: "Economy"
 *                   Adults: 2
 *                   Childrens: 0
 *                   Infants: 0
 *                   Price: 5000
 *                   DepartFlight:
 *                     FlightNo: "TG123"
 *                     DepartTime: "2025-10-27T08:00:00.000Z"
 *                     ArrivalTime: "2025-10-27T09:30:00.000Z"
 *                     AirlineName: "Thai Airways"
 *                   ReturnFlight:
 *                     FlightNo: "TG124"
 *                     DepartTime: "2025-10-30T10:00:00.000Z"
 *                     ArrivalTime: "2025-10-30T11:30:00.000Z"
 *                     AirlineName: "Thai Airways"
 *       400:
 *         description: Missing required parameters
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Missing required parameters. Please check your request."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error. Please try again later."
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ UserAccountID: string }> },
) {
    try {
        const { UserAccountID } = await params;

        const { searchParams } = new URL(req.url);
        const cartIds = searchParams
            .getAll("cartId")
            .map(Number)
            .filter(Boolean);
        if (!UserAccountID) {
            return NextResponse.json(
                {
                    success: false,
                    message: ErrorMessages.MISSING_PARAMETER,
                },
                {
                    status: 400,
                },
            );
        }

        if (cartIds.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: ErrorMessages.MISSING_PARAMETER,
                },
                {
                    status: 400,
                },
            );
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
            { status: 500 },
        );
    }
}
