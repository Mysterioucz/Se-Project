import prisma from "@/db";
import { Flight, CabinClass } from "@/src/generated/prisma";
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
                    NumberAvailable: {
                        gte: numberOfPassenger, // Ensure there are enough seats
                    },
                    cabinclass: classType
                        ? { Class: classType }
                        : {}, // If classType is specified, filter by class
                },
                include: {
                    cabinclass: true, // Include cabinclass for price and class type
                },
            });
        };

        const departingFlights = await findFlights(departureAirport, arrivalAirport, departDate, flightType);

        let returningFlights: Flight[] = [];
        if (flightType === 'round-trip' && returnDate) {
            returningFlights = await findFlights(arrivalAirport, departureAirport, returnDate, flightType);
        }

        // Function to format the flight data
        const formatFlightData = (flights: Flight[]) => {
            return flights.map((flight) => {
                const departureTime = new Date(flight.DepartTime);
                const arrivalTime = new Date(flight.ArrivalTime);
                const hours = (arrivalTime.getTime() - departureTime.getTime()) / 1000 / 3600; // Calculate hours
                return {
                    airlineName: flight.AirlineName,
                    departureTime: flight.DepartTime,
                    arrivalTime: flight.ArrivalTime,
                    hours,
                    cabinClass: flight.cabinclass.Class,
                    price: flight.cabinclass.Price,
                };
            });
        };

        // Combine both departing and returning flights into one array
        const combinedFlights = [
            ...formatFlightData(departingFlights),
            ...formatFlightData(returningFlights),
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
