import prisma from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";
import { ErrorMessages } from "@/src/enums/ErrorMessages";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ UserAccountID: string }> }
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
                .map(id => Number(id.trim()))
                .filter(id => !isNaN(id));
            
            if (cartIDs.length > 0) {
                whereClause.ID = { in: cartIDs };
            }
        }

        const carts = await prisma.cart.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" }
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
                const returnFlight = cart.ReturnFlightNo ? await prisma.flight.findFirst({
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
            const departureAirport = departFlight ? await prisma.airport.findUnique({
                where: { AirportID: departFlight.DepartureAirportID },
                select: { City: true },
                })
            : null;

            const arrivalAirport = departFlight ? await prisma.airport.findUnique({
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

export async function DELETE(req: NextRequest) {
  const UserAccountID = req.nextUrl.pathname.split('/').pop();

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
        { status: 400 }
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
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
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

export async function POST(req: NextRequest
) {
    const session = await getServerSession(nextAuthOptions);
    const url = new URL(req.url);
    const UserAccountID = url.pathname.split('/').pop(); 
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, message: ErrorMessages.AUTHENTICATION },
            { status: 401 }
        );
    }

    const requestedAccountID = UserAccountID;
    const sessionAccountID = session.user.id;

    if (requestedAccountID !== sessionAccountID) {
        return NextResponse.json(
            { success: false, message: ErrorMessages.AUTHENTICATION },
            { status: 403 } 
        );
    }

    try {
        const body = await req.json();

        if (!body.FlightType || !body.ClassType || !body.DepartFlightNo || !body.DepartFlightDepartTime) {
            return NextResponse.json(
                { success: false, message: ErrorMessages.MISSING_PARAMETER },
                { status: 400 }
            );
        }
        
        const existingCartItem = await prisma.cart.findFirst({
            where: {
                UserAccountID: session.user.id,
                DepartFlightNo: body.DepartFlightNo,
                DepartFlightDepartTime: new Date(body.DepartFlightDepartTime),
                DepartFlightArrivalTime: new Date(body.DepartFlightArrivalTime),
                ReturnFlightNo: body.ReturnFlightNo || null,
                ReturnFlightDepartTime: new Date(body.ReturnFlightDepartTime) || null,
                ReturnFlightArrivalTime: new Date(body.ReturnFlightArrivalTime) || null,
            }
        });

        if (existingCartItem) {
            return NextResponse.json(
                { success: false, message: "This flight is already in your cart." },
                { status: 409 }
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
                ...(body.ReturnFlightNo && { ReturnFlightNo: body.ReturnFlightNo }),
                ...(body.ReturnFlightDepartTime && { ReturnFlightDepartTime: new Date(body.ReturnFlightDepartTime) }),
                ...(body.ReturnFlightArrivalTime && { ReturnFlightArrivalTime: new Date(body.ReturnFlightArrivalTime) }),
                Price: body.Price,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Flight successfully added to your cart.",
                data: newCartItem, 
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("Error adding item to cart:", error);
        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER },
            { status: 500 }
        )
    }
}
