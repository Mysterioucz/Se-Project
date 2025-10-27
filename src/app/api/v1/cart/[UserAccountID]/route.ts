import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/cart/{UserAccountID}:
 *   get:
 *     summary: Get user's cart items
 *     description: Retrieve all cart items for a specific user, optionally filtered by cart IDs
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
 *         in: query
 *         description: Comma-separated cart IDs to filter
 *         required: false
 *         schema:
 *           type: string
 *           example: "1,2,3"
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
 *                   DepartureAirport: "BKK"
 *                   ArrivalAirport: "CNX"
 *                   DepartureCity: "Bangkok"
 *                   ArrivalCity: "Chiang Mai"
 *                   Depart:
 *                     FlightNo: "TG123"
 *                     DepartTime: "2025-10-27T08:00:00.000Z"
 *                     ArrivalTime: "2025-10-27T09:30:00.000Z"
 *                     AirlineName: "Thai Airways"
 *                     Stops: 0
 *                   Return:
 *                     FlightNo: "TG124"
 *                     DepartTime: "2025-10-30T10:00:00.000Z"
 *                     ArrivalTime: "2025-10-30T11:30:00.000Z"
 *                     AirlineName: "Thai Airways"
 *                     Stops: 0
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error. Please try again later."
 *   post:
 *     summary: Add flight to cart
 *     description: Add a new flight to the user's cart (requires authentication)
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: UserAccountID
 *         in: path
 *         description: User account ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - FlightType
 *               - ClassType
 *               - DepartFlightNo
 *               - DepartFlightDepartTime
 *             properties:
 *               FlightType:
 *                 type: string
 *                 example: One Way
 *               ClassType:
 *                 type: string
 *                 example: Economy
 *               Adults:
 *                 type: integer
 *               Childrens:
 *                 type: integer
 *               Infants:
 *                 type: integer
 *               DepartFlightNo:
 *                 type: string
 *               DepartFlightDepartTime:
 *                 type: string
 *                 format: date-time
 *               DepartFlightArrivalTime:
 *                 type: string
 *                 format: date-time
 *               ReturnFlightNo:
 *                 type: string
 *               ReturnFlightDepartTime:
 *                 type: string
 *                 format: date-time
 *               ReturnFlightArrivalTime:
 *                 type: string
 *                 format: date-time
 *               Price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Flight added to cart successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: 1
 *                 UserAccountID: "123e4567-e89b-12d3-a456-426614174000"
 *                 FlightType: "One Way"
 *                 ClassType: "Economy"
 *                 Adults: 1
 *                 Price: 2500
 *       400:
 *         description: Missing parameters or validation error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Missing required parameters. Please check your request."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Authentication required. Please log in."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "You do not have permission to perform this action."
 *       409:
 *         description: Flight already in cart
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "This item is already in the cart."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error. Please try again later."
 *   delete:
 *     summary: Remove flight from cart
 *     description: Delete a specific cart item
 *     tags:
 *       - Cart
 *     parameters:
 *       - name: UserAccountID
 *         in: path
 *         description: User account ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CartID
 *             properties:
 *               CartID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cart item deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Cart item deleted successfully"
 *       400:
 *         description: Missing CartID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Missing required parameters. Please check your request."
 *       404:
 *         description: Cart item not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "The requested resource could not be found."
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
    const { UserAccountID } = await params;
    const url = new URL(req.url);
    const cartIDsParam = url.searchParams.get("CartID");

    try {
        const whereClause: {
            UserAccountID: string;
            ID?: { in: number[] };
        } = { UserAccountID };

        // If ?cartIds=1,2,3 is passed, filter by those IDs too
        if (cartIDsParam) {
            const cartIDs = cartIDsParam
                .split(",")
                .map((id) => Number(id.trim()))
                .filter((id) => !isNaN(id));

            if (cartIDs.length > 0) {
                whereClause.ID = { in: cartIDs };
            }
        }

        const carts = await prisma.cart.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
        });

        const results = [];
        for (const cart of carts) {
            // Get Depart Flight info
            const departFlight = await prisma.flight.findFirst({
                where: {
                    FlightNo: cart.DepartFlightNo,
                    DepartTime: cart.DepartFlightDepartTime,
                    ArrivalTime: cart.DepartFlightArrivalTime,
                },
                select: {
                    AirlineName: true,
                    TransitAmount: true,
                    DepartureAirportID: true,
                    ArrivalAirportID: true,
                },
            });

            // Get Return Flight info (if exists)
            const returnFlight = cart.ReturnFlightNo
                ? await prisma.flight.findFirst({
                      where: {
                          FlightNo: cart.ReturnFlightNo,
                          DepartTime: cart.ReturnFlightDepartTime!,
                          ArrivalTime: cart.ReturnFlightArrivalTime!,
                      },
                      select: {
                          AirlineName: true,
                          TransitAmount: true,
                      },
                  })
                : null;

            // Get Airport cities
            const departureAirport = departFlight
                ? await prisma.airport.findUnique({
                      where: { AirportID: departFlight.DepartureAirportID },
                      select: { City: true },
                  })
                : null;

            const arrivalAirport = departFlight
                ? await prisma.airport.findUnique({
                      where: { AirportID: departFlight.ArrivalAirportID },
                      select: { City: true },
                  })
                : null;

            // Combine into one JSON object
            results.push({
                id: cart.ID,
                FlightType: cart.FlightType,
                ClassType: cart.ClassType,
                Adults: cart.Adults,
                Childrens: cart.Childrens,
                Infants: cart.Infants,
                Price: cart.Price,
                DepartureAirport: departFlight?.DepartureAirportID,
                ArrivalAirport: departFlight?.ArrivalAirportID,
                DepartureCity: departureAirport?.City ?? null,
                ArrivalCity: arrivalAirport?.City ?? null,

                Depart: {
                    FlightNo: cart.DepartFlightNo,
                    DepartTime: cart.DepartFlightDepartTime,
                    ArrivalTime: cart.DepartFlightArrivalTime,
                    AirlineName: departFlight?.AirlineName ?? null,
                    Stops: departFlight?.TransitAmount ?? null,
                },

                Return: cart.ReturnFlightNo
                    ? {
                          FlightNo: cart.ReturnFlightNo,
                          DepartTime: cart.ReturnFlightDepartTime,
                          ArrivalTime: cart.ReturnFlightArrivalTime,
                          AirlineName: returnFlight?.AirlineName ?? null,
                          Stops: returnFlight?.TransitAmount ?? null,
                      }
                    : null,
            });
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: results,
            }),
            { status: 200 },
        );
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

export async function DELETE(req: NextRequest) {
    const UserAccountID = req.nextUrl.pathname.split("/").pop();

    try {
        // Parse CartID from body
        const body = await req.json();
        const { CartID } = body;

        if (!CartID) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Missing CartID in request body",
                }),
                { status: 400 },
            );
        }

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
                { status: 404 },
            );
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
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

export async function POST(req: NextRequest) {
    const session = await getServerSession(nextAuthOptions);
    const url = new URL(req.url);
    const UserAccountID = url.pathname.split("/").pop();
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: ErrorMessages.AUTHENTICATION },
            { status: 401 },
        );
    }

    const requestedAccountID = UserAccountID;
    const sessionAccountID = session.user.id;

    if (requestedAccountID !== sessionAccountID) {
        return NextResponse.json(
            { success: false, message: ErrorMessages.AUTHENTICATION },
            { status: 403 },
        );
    }

    try {
        const body = await req.json();

        if (
            !body.FlightType ||
            !body.ClassType ||
            !body.DepartFlightNo ||
            !body.DepartFlightDepartTime
        ) {
            return NextResponse.json(
                { success: false, message: ErrorMessages.MISSING_PARAMETER },
                { status: 400 },
            );
        }

        const existingCartItem = await prisma.cart.findFirst({
            where: {
                UserAccountID: session.user.id,
                DepartFlightNo: body.DepartFlightNo,
                DepartFlightDepartTime: new Date(body.DepartFlightDepartTime),
                DepartFlightArrivalTime: new Date(body.DepartFlightArrivalTime),
                ReturnFlightNo: body.ReturnFlightNo || null,
                ReturnFlightDepartTime:
                    new Date(body.ReturnFlightDepartTime) || null,
                ReturnFlightArrivalTime:
                    new Date(body.ReturnFlightArrivalTime) || null,
            },
        });

        if (existingCartItem) {
            return NextResponse.json(
                {
                    success: false,
                    message: "This flight is already in your cart.",
                },
                { status: 409 },
            );
        }

        const newCartItem = await prisma.cart.create({
            data: {
                UserAccountID: session.user.id,
                FlightType: body.FlightType,
                ClassType: body.ClassType,
                Adults: body.Adults,
                Childrens: body.Childrens,
                Infants: body.Infants,
                DepartFlightNo: body.DepartFlightNo,
                DepartFlightDepartTime: new Date(body.DepartFlightDepartTime),
                DepartFlightArrivalTime: new Date(body.DepartFlightArrivalTime),
                ...(body.ReturnFlightNo && {
                    ReturnFlightNo: body.ReturnFlightNo,
                }),
                ...(body.ReturnFlightDepartTime && {
                    ReturnFlightDepartTime: new Date(
                        body.ReturnFlightDepartTime,
                    ),
                }),
                ...(body.ReturnFlightArrivalTime && {
                    ReturnFlightArrivalTime: new Date(
                        body.ReturnFlightArrivalTime,
                    ),
                }),
                Price: body.Price,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Flight successfully added to your cart.",
                data: newCartItem,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error adding item to cart:", error);
        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER },
            { status: 500 },
        );
    }
}
