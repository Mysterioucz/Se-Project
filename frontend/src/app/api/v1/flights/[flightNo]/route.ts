import prisma from "@/db";
import { Flight } from "@/src/generated/prisma";
import { NextRequest } from "next/server";

// Next.js API route handler for flights
export async function POST(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    // Assume we need every parameters in the top search bar to be able to click search button
    let flightType = searchParams.get('flightType'); // 'one-way' or 'round-trip'     @optiional  @default: one-way
    const classType = searchParams.get('classType'); // 'Economy', 'Business', etc.   @optional   @default: null means all
    const departureAirport = searchParams.get('departureAirport'); // AirportID       @required
    const arrivalAirport = searchParams.get('arrivalAirport'); // AirportID           @required
    const departDate = searchParams.get('departDate'); //                             @required   @default: null means all
    const returnDate = searchParams.get('returnDate'); //                             @required   only have flight type is round-trip
    let numberOfPassenger = searchParams.get('numberOfPassenger'); //                 @required
    
    // Handle missing parameters
    if (!departureAirport || !arrivalAirport || !departDate || !numberOfPassenger) {
        return new Response(JSON.stringify({
            success: false,
            error: "Missing required search parameters",
        }), { status: 400 }); // bad request
    }
    if (flightType === 'round-trip' && !returnDate) {
        return new Response(JSON.stringify({
            success: false,
            error: "returnDate is required for round-trip flights.",
        }), { status: 400 }); // bad request
    }
    if (! flightType) {
        flightType = 'one-way';
    }

    try {
        const findFlights = async (departAirport: string, arriveAirport: string, date: string) => {
            const searchDate = new Date(date);
            const startOfDay = new Date(searchDate.setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(searchDate.setUTCHours(23, 59, 59, 999));

            const flights = await prisma.flight.findMany({
                where: {
                    DepartureAirportID: departAirport,
                    ArrivalAirportID: arriveAirport,
                    // TODO after split schedule in schema
                    Schedule: {
                        gte: startOfDay, // Greater than or equal to the start of the day
                        lte: endOfDay,   // Less than or equal to the end of the day
                    },
                    aircraft: {
                        cabins: {
                            some: {
                                Class: classType,
                            },
                        },
                    },
                },
                include: {
                    airline: true,
                    departureAirport: true,
                    arrivalAirport: true,
                    aircraft: {
                        include: {
                            cabins: {
                                where: {
                                    Class: classType
                                }
                            }
                        }
                    }
                },
            });
            // TODO change to available seat left
            const availableFlights = flights.filter(flight => {
                const totalCapacity = flight.aircraft.SeatCapacity;
                return totalCapacity >= Number(numberOfPassenger);
            });

            return availableFlights;
        };

        const departingFlights = await findFlights(departureAirport, arrivalAirport, departDate);
        let returningFlights:Flight[] = [];
        if (flightType === 'round-trip' && returnDate) {
            returningFlights = await findFlights(arrivalAirport, departureAirport, returnDate); // swap airport
        }

        return new Response(JSON.stringify({
            success: true,
            data: { // return as 2 arrays
                departingFlights,
                returningFlights, // Will be an empty array for one-way searches
            },
        }), { status: 200 });
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
