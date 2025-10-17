import prisma from "@/db";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";
import { ErrorMessages } from "@/src/enums/ErrorMessages";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ UserAccountID: string }> }
) {
    const { UserAccountID } = await params;

    try {
        const carts = await prisma.cart.findMany({
            where: { UserAccountID },
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

