import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//need to modify later to work correctly
export async function POST(req: NextRequest) {
    const session = await getServerSession(nextAuthOptions);

    if (!session?.user?.id) {
        return new Response(
            JSON.stringify({ success: false, message: ErrorMessages.AUTHENTICATION }),
            { status: 401 }
        );
    }

    try {
        const body = await req.json();

        if (!body.flightType || !body.classType || !body.departFlightNo || !body.departFlightDepartTime) {
            return new Response(
                JSON.stringify({ success: false, message: ErrorMessages.MISSING_PARAMETER }),
                { status: 400 }
            );
        }
        
        // Uniqueness check remains the same
        const existingCartItem = await prisma.cart.findFirst({
            where: {
                UserAccountID: session.user.id,
                departFlightNo: body.departFlightNo,
                departFlightDepartTime: new Date(body.departFlightDepartTime),
                returnFlightNo: body.returnFlightNo || null,
            }
        });

        if (existingCartItem) {
            return new Response(
                JSON.stringify({ success: false, message: "This flight is already in your cart." }),
                { status: 409 }
            );
        }

        const newCartItem = await prisma.cart.create({
            data: {
                flightType: body.flightType,
                classType: body.classType,
                UserAccountID: session.user.id,
                departFlightNo: body.departFlightNo,
                departFlightDepartTime: new Date(body.departFlightDepartTime),
                departFlightArrivalTime: new Date(body.departFlightArrivalTime),
                ...(body.returnFlightNo && { returnFlightNo: body.returnFlightNo }),
                ...(body.returnFlightDepartTime && { returnFlightDepartTime: new Date(body.returnFlightDepartTime) }),
                ...(body.returnFlightArrivalTime && { returnFlightArrivalTime: new Date(body.returnFlightArrivalTime) }),
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Flight successfully added to your cart.",
                data: newCartItem, 
            }),
            { status: 201 }
        );

    } catch (error) {
        console.error("Error adding item to cart:", error);
        return new Response(
            JSON.stringify({ success: false, message: ErrorMessages.SERVER }),
            { status: 500 }
        );
    }
}


export async function DELETE(req: NextRequest) {
    const session = await getServerSession(nextAuthOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: ErrorMessages.AUTHENTICATION },
            { status: 401 }
        );
    }

    try {
        const { cartId } = await req.json();

        if (!cartId || isNaN(parseInt(cartId))) {
            return NextResponse.json(
                { success: false, message: ErrorMessages.MISSING_PARAMETER },
                { status: 400 }
            );
        }
        const cartItemId = parseInt(cartId);

        const cartItem = await prisma.cart.findFirst({
            where: {
                id: cartItemId,
                UserAccountID: session.user.id,
            },
        });

        if (!cartItem) {
            return NextResponse.json(
                { success: false, message: ErrorMessages.PERMISSION },
                { status: 403 }
            );
        }
        
        await prisma.cart.delete({ where: { id: cartItemId, UserAccountID: session.user.id } });

        return NextResponse.json(
            { success: true, message: "Item removed from cart." },
            { status: 200 }
            );
    } catch (error) {
        console.error("Error deleting cart item:", error);
        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(nextAuthOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { success: false, message: ErrorMessages.AUTHENTICATION },
      { status: 401 }
    );
  }

  try {
        // Fetch cart items with all relations needed for price calculation
        const cartItemsFromDb = await prisma.cart.findMany({
            where: { UserAccountID: session.user.id },
            include: {
                // To get the price, we need to go from the flight to its aircraft, then to the aircraft's cabins
                departFlight: {
                    include: {
                        aircraft: { 
                            include: { 
                                cabins: true // This gets all cabin classes for the aircraft
                            } 
                        },
                        departureAirport: true,
                        arrivalAirport: true,
                        airline: true,
                    }
                },
                returnFlight: {
                    include: {
                        aircraft: { 
                            include: { 
                                cabins: true 
                            } 
                        },
                        departureAirport: true,
                        arrivalAirport: true,
                        airline: true,
                    }
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        // Process each item to find and attach the correct price
        const cartItemsWithPrice = cartItemsFromDb.map(item => {
            let departPrice = 0;
            let returnPrice = 0;

            // Find the correct cabin for the departure flight based on the classType stored in the cart
            if (item.departFlight?.aircraft?.cabins) {
                const cabin = item.departFlight.aircraft.cabins.find(c => c.Class === item.classType);
                departPrice = cabin?.StandardPrice || 0; // Use the price from that cabin
            }

            // Do the same for the return flight if it exists
            if (item.returnFlight?.aircraft?.cabins) {
                const cabin = item.returnFlight.aircraft.cabins.find(c => c.Class === item.classType);
                returnPrice = cabin?.StandardPrice || 0;
            }
            
            return {
                ...item,
                totalPrice: departPrice + returnPrice,
            };
        });

        return new Response(JSON.stringify({ success: true, data: cartItemsWithPrice }), { status: 200 });

  } catch (err) {
    console.error("Error fetching cart items:", err);
    return NextResponse.json(
      { success: false, message: ErrorMessages.SERVER },
      { status: 500 }
    );
  }
}