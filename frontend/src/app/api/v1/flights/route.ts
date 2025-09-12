import prisma from "@/db";
import { Flight, CabinClass, Aircraft } from "@/src/generated/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    // Extract parameters
    let flightType = searchParams.get('flightType') ?? 'one-way';
    const classType = searchParams.get('classType');
    const departureAirport = searchParams.get('departureAirport');
    const arrivalAirport = searchParams.get('arrivalAirport');
    const departDate = searchParams.get('departDate');
    const returnDate = searchParams.get('returnDate');
    const numberOfPassenger = parseInt(searchParams.get('numberOfPassenger') ?? '0', 10);

    // Validation
    if (!departureAirport || !arrivalAirport || !departDate || !numberOfPassenger) {
        return new Response(JSON.stringify({
            success: false,
            error: "Missing required search parameters",
        }), { status: 400 });
    }

    try {
        // Function to find flights based on the criteria
        const findFlights = async (departAirport: string, arriveAirport: string, date: string, flightType: string) => {
            const searchDate = new Date(date);
            const startOfDay = new Date(searchDate.setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(searchDate.setUTCHours(23, 59, 59, 999));

            return await prisma.flight.findMany({
                where: {
                    DepartureAirportID: departAirport,
                    ArrivalAirportID: arriveAirport,
                    DepartTime: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    AvailableSeat: {
                        gte: numberOfPassenger, // Ensure there are enough seats
                    },
                },
                include: {
                    aircraft: { // Join aircraft table via AircraftRegNo in flight
                        select: {
                            AircraftRegNo: true, // We need AircraftRegNo to join with cabinclass
                        },
                    },
                },
            });
        };

        const departingFlights = await findFlights(departureAirport, arrivalAirport, departDate, flightType);

        let returningFlights: Flight[] = [];
        if (flightType === 'round-trip' && returnDate) {
            returningFlights = await findFlights(arrivalAirport, departureAirport, returnDate, flightType);
        }

        // Now we will join cabinclass via AircraftRegNo in aircraft
        const formatFlightData = async (flights: Flight[]) => {
            const formattedFlights = [];

            for (let flight of flights) {
                const aircraft = flight.aircraft;
                
                if (aircraft) {
                    // Join with cabinclass by AircraftRegNo
                    const cabinClass = await prisma.cabinClass.findFirst({
                        where: {
                            AircraftRegNo: aircraft.AircraftRegNo,
                            Class: classType ? { equals: classType } : undefined, // If classType is specified, filter by class
                        },
                    });

                    // Calculate hours
                    const departureTime = new Date(flight.DepartTime);
                    const arrivalTime = new Date(flight.ArrivalTime);
                    const hours = (arrivalTime.getTime() - departureTime.getTime()) / 1000 / 3600; // Calculate hours
                    
                    // Push formatted data
                    formattedFlights.push({
                        airlineName: flight.AirlineName,
                        departureTime: flight.DepartTime,
                        arrivalTime: flight.ArrivalTime,
                        hours,
                        cabinClass: cabinClass ? cabinClass.Class : null,
                        price: cabinClass ? cabinClass.StandardPrice : null,
                    });
                }
            }

            return formattedFlights;
        };

        // Format both departing and returning flights
        const formattedDepartingFlights = await formatFlightData(departingFlights);
        const formattedReturningFlights = await formatFlightData(returningFlights);

        // Combine both departing and returning flights into one array
        const combinedFlights = [
            ...formattedDepartingFlights,
            ...formattedReturningFlights,
        ];

        return new Response(JSON.stringify({
            success: true,
            data: combinedFlights,
        }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error processing request",
            }),
            { status: 500 }
        );
    }
}
