import prisma from "@/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    // Extract parameters
    const flightType = searchParams.get('flightType') ?? 'one-way';
    const classType = searchParams.get('classType');
    // departureAirports and arrivalAirports are list
    const departureAirports = searchParams.get('departureAirport')?.split(',').filter(Boolean);
    const arrivalAirports = searchParams.get('arrivalAirport')?.split(',').filter(Boolean);
    const departDate = searchParams.get('departDate');
    const returnDate = searchParams.get('returnDate');
    const numberOfPassenger = parseInt(searchParams.get('numberOfPassenger') ?? '0', 10);

    // Parameters for Filter and Sort
    const airlines = searchParams.get('airlines')?.split(',').filter(Boolean);
    const departureTimeRangeStr = searchParams.get('departureTimeRange')?.split(',');
    const arrivalTimeRangeStr = searchParams.get('arrivalTimeRange')?.split(',');
    const sortBy = searchParams.get('sortBy');

    const departureTimeRange = departureTimeRangeStr?.map(t => parseInt(t, 10)).filter(t => !isNaN(t));
    const arrivalTimeRange = arrivalTimeRangeStr?.map(t => parseInt(t, 10)).filter(t => !isNaN(t));

    // CHANGED: Update validation to check for non-empty arrays
    if (!departureAirports || departureAirports.length === 0 || !arrivalAirports || arrivalAirports.length === 0 || !departDate || !numberOfPassenger) {
        return new Response(JSON.stringify({
            success: false,
            error: "Missing required search parameters",
        }), { status: 400 });
    }

    try {
        const findFlights = async (departAirports: string[], arriveAirports: string[], date: string) => {
            const searchDate = new Date(date);
            const startOfDay = new Date(searchDate.setUTCHours(0, 0, 0, 0));
            const endOfDay = new Date(searchDate.setUTCHours(23, 59, 59, 999));
            
            return await prisma.flight.findMany({
                where: {
                    DepartureAirportID: { in: departAirports },
                    ArrivalAirportID: { in: arriveAirports },
                    DepartTime: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                    AvailableSeat: {
                        gte: numberOfPassenger,
                    },
                    ...(airlines && airlines.length > 0 && { AirlineName: { in: airlines } })
                },
                include: {
                    aircraft: true,
                },
            });
        };

        type FlightWithAircraft = Awaited<ReturnType<typeof findFlights>>[number];
        const formatFlightData = async (flights: FlightWithAircraft[]) => {
            const formattedFlights = [];

            for (const flight of flights) {
                const aircraft = flight.aircraft;
                if (aircraft) {
                    const cabinClasses = await prisma.cabinClass.findMany({
                        where: {
                            AircraftRegNo: aircraft.AircraftRegNo,
                            Class: classType ? classType : undefined,
                        },
                    });

                    for (const cabinClass of cabinClasses) {
                        const departureTime = new Date(flight.DepartTime);
                        const arrivalTime = new Date(flight.ArrivalTime);
                        const hours = (arrivalTime.getTime() - departureTime.getTime()) / 1000 / 3600;

                        formattedFlights.push({
                            airlineName: flight.AirlineName,
                            flightNo: flight.FlightNo,
                            departureAirportID: flight.DepartureAirportID,
                            arrivalAirportID: flight.ArrivalAirportID,
                            departureTime: flight.DepartTime,
                            arrivalTime: flight.ArrivalTime,
                            hours: parseFloat(hours.toFixed(2)),
                            cabinClass: cabinClass.Class,
                            price: cabinClass.StandardPrice,
                            aircraftModel: aircraft.ModelName,
                            seatCapacity: aircraft.SeatCapacity,
                            transitAmount: flight.TransitAmount,
                        });
                    }
                }
            }

            return formattedFlights;
        };
        
        // CHANGED: Pass the airport arrays to the findFlights function
        let departingFlights = await findFlights(departureAirports, arrivalAirports, departDate);
        let returningFlights: FlightWithAircraft[] = [];

        if (departureTimeRange && departureTimeRange.length === 2) {
            departingFlights = departingFlights.filter(f => {
                const hour = new Date(f.DepartTime).getUTCHours();
                return hour >= departureTimeRange[0] && hour <= departureTimeRange[1];
            });
        }
        if (arrivalTimeRange && arrivalTimeRange.length === 2) {
             departingFlights = departingFlights.filter(f => {
                const hour = new Date(f.ArrivalTime).getUTCHours();
                return hour >= arrivalTimeRange[0] && hour <= arrivalTimeRange[1];
            });
        }
        
        if (flightType === 'round-trip' && returnDate) {
            // CHANGED: Swap departure and arrival airports for the return flight
            returningFlights = await findFlights(arrivalAirports, departureAirports, returnDate);

            if (departureTimeRange && departureTimeRange.length === 2) {
                returningFlights = returningFlights.filter(f => {
                    const hour = new Date(f.DepartTime).getUTCHours();
                    return hour >= departureTimeRange[0] && hour <= departureTimeRange[1];
                });
            }
            if (arrivalTimeRange && arrivalTimeRange.length === 2) {
                 returningFlights = returningFlights.filter(f => {
                    const hour = new Date(f.ArrivalTime).getUTCHours();
                    return hour >= arrivalTimeRange[0] && hour <= arrivalTimeRange[1];
                });
            }
        }

        const formattedDepartingFlights = await formatFlightData(departingFlights);
        const formattedReturningFlights = await formatFlightData(returningFlights);

        const combinedFlights = [
            ...formattedDepartingFlights,
            ...formattedReturningFlights,
        ];

        switch (sortBy) {
            case 'Price':
                combinedFlights.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
                break;
            case 'Flight duration':
                combinedFlights.sort((a, b) => a.hours - b.hours);
                break;
            case 'No. of stops':
                combinedFlights.sort((a, b) => a.transitAmount - b.transitAmount);
                break;
            default:
                combinedFlights.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
                break;
        }

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