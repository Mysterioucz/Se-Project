import prisma from "@/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;

    // Extract parameters
    const flightType = searchParams.get("flightType") ?? "One Way";
    const classType = searchParams.get("classType");
    const departureCity = searchParams.get("departureCity");
    const arrivalCity = searchParams.get("arrivalCity");
    const departDate = searchParams.get("departDate");
    const returnDate = searchParams.get("returnDate");
    const numberOfPassenger = parseInt(
        searchParams.get("numberOfPassenger") ?? "1",
        10
    );

    // Parameters for Filter and Sort
    const airlines = searchParams.get("airlines")?.split(",").filter(Boolean);
    const departureTimeRangeStr = searchParams
        .get("departureTimeRange")
        ?.split(",");
    const arrivalTimeRangeStr = searchParams
        .get("arrivalTimeRange")
        ?.split(",");
    const sortBy = searchParams.get("sortBy");

    const departureTimeRange = departureTimeRangeStr
        ?.map((t) => parseInt(t, 10))
        .filter((t) => !isNaN(t));
    const arrivalTimeRange = arrivalTimeRangeStr
        ?.map((t) => parseInt(t, 10))
        .filter((t) => !isNaN(t));

    // CHANGED: Validate departureCity and arrivalCity
    if (!departureCity || !arrivalCity || !departDate || !numberOfPassenger) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "Missing required search parameters",
            }),
            { status: 400 }
        );
    }

    try {
        // Fetch Airport IDs based on cities
        const departureAirports = await prisma.airport.findMany({
            where: {
                City: departureCity,
            },
            select: {
                AirportID: true,
            },
        });
        const arrivalAirports = await prisma.airport.findMany({
            where: {
                City: arrivalCity,
            },
            select: {
                AirportID: true,
            },
        });

        if (departureAirports.length === 0 || arrivalAirports.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: "No airports found for the specified cities",
                }),
                { status: 404 }
            );
        }

        // Extract AirportIDs from the results
        const departureAirportIDs = departureAirports.map((airport) => airport.AirportID);
        const arrivalAirportIDs = arrivalAirports.map((airport) => airport.AirportID);

        // Helper function to find flights
        const findFlights = async (
            departAirports: string[],
            arriveAirports: string[],
            date: string
        ) => {
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
                    ...(airlines && airlines.length > 0 && {
                        AirlineName: { in: airlines },
                    }),
                },
                include: {
                    aircraft: true,
                },
            });
        };

        type FlightWithAircraft = Awaited<
            ReturnType<typeof findFlights>
        >[number];

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
                        const durationInMilliseconds = arrivalTime.getTime() - departureTime.getTime();
                        const durationInMinutes = durationInMilliseconds / 1000 / 60;

                        // Format duration as "Xh Ym"
                        const hours = Math.floor(durationInMinutes / 60);
                        const minutes = Math.floor(durationInMinutes % 60);
                        const formattedDuration = `${hours}h ${minutes}m`;

                        // Format departHours and arrivalHours as "HH:mm"
                        const padZero = (num: number) => num.toString().padStart(2, "0");
                        const departHours = `${padZero(departureTime.getUTCHours())}:${padZero(departureTime.getUTCMinutes())}`;
                        const arrivalHours = `${padZero(arrivalTime.getUTCHours())}:${padZero(arrivalTime.getUTCMinutes())}`;

                        formattedFlights.push({
                            airlineName: flight.AirlineName,
                            flightNo: flight.FlightNo,
                            departureAirportID: flight.DepartureAirportID,
                            arrivalAirportID: flight.ArrivalAirportID,
                            departCity: departureCity,       // <-- Added
                            arrivalCity: arrivalCity,      // <-- Added
                            departureTime: flight.DepartTime,
                            arrivalTime: flight.ArrivalTime,
                            departHours,
                            arrivalHours,
                            duration: formattedDuration,
                            durationInMinutes,
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

        let departingFlights = await findFlights(
            departureAirportIDs,
            arrivalAirportIDs,
            departDate
        );
        let returningFlights: FlightWithAircraft[] = [];

        if (departureTimeRange && departureTimeRange.length === 2) {
            departingFlights = departingFlights.filter((f) => {
                const hour = new Date(f.DepartTime).getUTCHours();
                return (
                    hour >= departureTimeRange[0] &&
                    hour <= departureTimeRange[1]
                );
            });
        }
        if (arrivalTimeRange && arrivalTimeRange.length === 2) {
            departingFlights = departingFlights.filter((f) => {
                const hour = new Date(f.ArrivalTime).getUTCHours();
                return (
                    hour >= arrivalTimeRange[0] && hour <= arrivalTimeRange[1]
                );
            });
        }

        if (flightType === "Round Trip" && returnDate) {
            returningFlights = await findFlights(
                arrivalAirportIDs,
                departureAirportIDs,
                returnDate
            );

            if (departureTimeRange && departureTimeRange.length === 2) {
                returningFlights = returningFlights.filter((f) => {
                    const hour = new Date(f.DepartTime).getUTCHours();
                    return (
                        hour >= departureTimeRange[0] &&
                        hour <= departureTimeRange[1]
                    );
                });
            }
            if (arrivalTimeRange && arrivalTimeRange.length === 2) {
                returningFlights = returningFlights.filter((f) => {
                    const hour = new Date(f.ArrivalTime).getUTCHours();
                    return (
                        hour >= arrivalTimeRange[0] &&
                        hour <= arrivalTimeRange[1]
                    );
                });
            }
        }

        const formattedDepartingFlights = await formatFlightData(
            departingFlights
        );
        const formattedReturningFlights = await formatFlightData(
            returningFlights
        );

        const combinedFlights = [
            ...formattedDepartingFlights,
            ...formattedReturningFlights,
        ];

        switch (sortBy) {
            case "price":
                combinedFlights.sort(
                    (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)
                );
                break;
            case "duration":
                combinedFlights.sort((a, b) => a.durationInMinutes - b.durationInMinutes);
                break;
            case "stops":
                combinedFlights.sort(
                    (a, b) => a.transitAmount - b.transitAmount
                );
                break;
            default:
                combinedFlights.sort(
                    (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)
                );
                break;
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: combinedFlights,
            }),
            { status: 200 }
        );
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
