import prisma from "@/db";
import { Flight } from "@/src/generated/prisma";
import { NextRequest } from "next/server";

// Next.js API route handler for flights
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ flightNo: string }> }
) {
    // const { flightType, classType, departureAirport, arrivalAirport, departDate, returnDate } = await req.json();
    try {

        const { searchParams } = req.nextUrl;

        const flightType = searchParams.get('flightType'); // 'one-way' or 'round-trip'
        const classType = searchParams.get('classType'); // 'Economy', 'Business', etc.
        const departureAirport = searchParams.get('departureAirport'); // AirportID
        const arrivalAirport = searchParams.get('arrivalAirport'); // AirportID
        const departDate = searchParams.get('departDate'); 
        const returnDate = searchParams.get('returnDate'); 
        const numberOfPassenger = searchParams.get('numberOfPassenger');
        
        if (!flightType || !classType || !departureAirport || !arrivalAirport || !departDate || !numberOfPassenger) {
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
        console.log(1);

        const findFlights = async (departAirport: string, arriveAirport: string, date: string) => {
            const searchDate = new Date(date);
            const startOfDay = new Date(searchDate.setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(searchDate.setUTCHours(23, 59, 59, 999));

            const flights = await prisma.flight.findMany({
                where: {
                    DepartureAirportID: departAirport,
                    ArrivalAirportID: arriveAirport,
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
            data: {
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
