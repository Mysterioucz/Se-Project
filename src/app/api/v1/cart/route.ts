import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const BodySchema = z.object({
  ticketId: z.string().min(1, "ticketId is required"),
  flightType: z.string().min(1), 
  classType: z.string().min(1),
});

//need to modify later to work correctly
export async function POST(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  const { accountId } = params;

  //Authentication: ensure user is logged in and matches accountId param
  const session = await getServerSession(nextAuthOptions);
  if (!session?.user?.id || String(session.user.id) !== accountId) {
    return NextResponse.json(
      { error: { message: ErrorMessages.AUTHENTICATION } },
      { status: 401 }
    );
  }

  try {
    const {ticketId, flightType, classType} = BodySchema.parse(
      await request.json()
    );

    //Ensure ticket exists (and fetch flight fields needed for Cart)
    const ticket = await prisma.ticket.findUnique({
      where: { TicketID: ticketId },
      select: {
        TicketID: true,
        FlightNo: true,
        DepartTime: true,
        ArrivalTime: true,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: { code: "TICKET_NOT_FOUND", message: "Ticket not found." } },
        { status: 404 }
      );
    }

    // “Already in cart” check for this user.
    // Since Cart doesn’t store TicketID in your schema, we treat duplicates
    // as same user + same flight + same class/flight type.
    const existing = await prisma.cart.findFirst({
      where: {
        UserAccountID: accountId,
        flightType,
        classType,
        departFlightNo: ticket.FlightNo,
        departFlightDepartTime: ticket.DepartTime,
        departFlightArrivalTime: ticket.ArrivalTime,
        // If you also add return flights later, include them here for uniqueness.
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: {
            code: "ALREADY_IN_CART",
            message: "This ticket/flight is already in your cart.",
          },
        },
        { status: 409 }
      );
    }

    // 5) Create cart row
    const cart = await prisma.cart.create({
      data: {
        UserAccountID: accountId,
        flightType,
        classType,
        // Map ticket’s flight to the required composite fields on Cart
        departFlightNo: ticket.FlightNo,
        departFlightDepartTime: ticket.DepartTime,
        departFlightArrivalTime: ticket.ArrivalTime,
        // If round-trip is supported, set return* fields from body as needed.
      },
      select: {
        id: true,
        UserAccountID: true,
        flightType: true,
        classType: true,
        departFlightNo: true,
        departFlightDepartTime: true,
        departFlightArrivalTime: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: { cart },
      },
      {
        status: 201,
        headers: {
          Location: `/api/v1/cart/${accountId}/${cart.id}`,
        },
      }
    );
  } catch (error) {
    console.error(error);
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