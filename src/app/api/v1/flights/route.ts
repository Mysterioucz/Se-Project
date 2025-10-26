import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/flights:
 *   get:
 *     summary: Search for flights
 *     description: Search for one-way or round-trip flights based on departure city, arrival city, and dates. Supports filtering by airlines, time ranges, and sorting.
 *     tags:
 *       - Flights
 *     parameters:
 *       - name: flightType
 *         in: query
 *         description: Type of flight (One Way or Round Trip)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [One Way, Round Trip]
 *           default: One Way
 *       - name: classType
 *         in: query
 *         description: Cabin class type
 *         required: false
 *         schema:
 *           type: string
 *           example: Economy
 *       - name: departureCity
 *         in: query
 *         description: Departure city name
 *         required: true
 *         schema:
 *           type: string
 *           example: Bangkok
 *       - name: arrivalCity
 *         in: query
 *         description: Arrival city name
 *         required: true
 *         schema:
 *           type: string
 *           example: Chiang Mai
 *       - name: departDate
 *         in: query
 *         description: Departure date (YYYY-MM-DD format)
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-10-27
 *       - name: returnDate
 *         in: query
 *         description: Return date (YYYY-MM-DD format, required for Round Trip)
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: 2025-10-30
 *       - name: numberOfPassenger
 *         in: query
 *         description: Number of passengers
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - name: airlines
 *         in: query
 *         description: Filter by airline names (comma-separated)
 *         required: false
 *         schema:
 *           type: string
 *           example: Thai Airways,Bangkok Airways
 *       - name: departureTimeRange
 *         in: query
 *         description: Departure time range in hours (comma-separated, e.g., "6,12" for 6 AM to 12 PM)
 *         required: false
 *         schema:
 *           type: string
 *           example: 6,12
 *       - name: arrivalTimeRange
 *         in: query
 *         description: Arrival time range in hours (comma-separated)
 *         required: false
 *         schema:
 *           type: string
 *           example: 14,18
 *       - name: sortBy
 *         in: query
 *         description: Sort results by price, duration, or stops
 *         required: false
 *         schema:
 *           type: string
 *           enum: [price, duration, stops]
 *           default: price
 *     responses:
 *       200:
 *         description: Successfully retrieved flights
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       airlineName:
 *                         type: string
 *                       flightNo:
 *                         type: string
 *                       departureAirportID:
 *                         type: string
 *                       arrivalAirportID:
 *                         type: string
 *                       departCity:
 *                         type: string
 *                       arrivalCity:
 *                         type: string
 *                       departureTime:
 *                         type: string
 *                         format: date-time
 *                       arrivalTime:
 *                         type: string
 *                         format: date-time
 *                       departHours:
 *                         type: string
 *                       arrivalHours:
 *                         type: string
 *                       duration:
 *                         type: string
 *                       durationInMinutes:
 *                         type: number
 *                       cabinClass:
 *                         type: string
 *                       price:
 *                         type: number
 *                       aircraftModel:
 *                         type: string
 *                       seatCapacity:
 *                         type: integer
 *                       transitAmount:
 *                         type: integer
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: No flights found
 *       500:
 *         description: Server error
 */
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
        10,
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
                error: ErrorMessages.MISSING_PARAMETER,
            }),
            { status: 400 },
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
                    error: ErrorMessages.NOT_FOUND,
                }),
                { status: 404 },
            );
        }

        // Extract AirportIDs from the results
        const departureAirportIDs = departureAirports.map(
            (airport) => airport.AirportID,
        );
        const arrivalAirportIDs = arrivalAirports.map(
            (airport) => airport.AirportID,
        );

        // Helper function to find flights
        const findFlights = async (
            departAirports: string[],
            arriveAirports: string[],
            date: string,
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
                    ...(airlines &&
                        airlines.length > 0 && {
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
                        const durationInMilliseconds =
                            arrivalTime.getTime() - departureTime.getTime();
                        const durationInMinutes =
                            durationInMilliseconds / 1000 / 60;

                        // Format duration as "Xh Ym"
                        const hours = Math.floor(durationInMinutes / 60);
                        const minutes = Math.floor(durationInMinutes % 60);
                        const formattedDuration = `${hours}h ${minutes}m`;

                        // Format departHours and arrivalHours as "HH:mm"
                        const padZero = (num: number) =>
                            num.toString().padStart(2, "0");
                        const departHours = `${padZero(departureTime.getUTCHours())}:${padZero(departureTime.getUTCMinutes())}`;
                        const arrivalHours = `${padZero(arrivalTime.getUTCHours())}:${padZero(arrivalTime.getUTCMinutes())}`;

                        formattedFlights.push({
                            airlineName: flight.AirlineName,
                            flightNo: flight.FlightNo,
                            departureAirportID: flight.DepartureAirportID,
                            arrivalAirportID: flight.ArrivalAirportID,
                            departCity: departureCity, // <-- Added
                            arrivalCity: arrivalCity, // <-- Added
                            departureTime: flight.DepartTime, // Date Type
                            arrivalTime: flight.ArrivalTime, // Date Type
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
            departDate,
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
                returnDate,
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

        const formattedDepartingFlights =
            await formatFlightData(departingFlights);
        const formattedReturningFlights =
            await formatFlightData(returningFlights);

        const combinedFlights = [
            ...formattedDepartingFlights,
            ...formattedReturningFlights,
        ];

        switch (sortBy) {
            case "price":
                combinedFlights.sort(
                    (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
                );
                break;
            case "duration":
                combinedFlights.sort(
                    (a, b) => a.durationInMinutes - b.durationInMinutes,
                );
                break;
            case "stops":
                combinedFlights.sort(
                    (a, b) => a.transitAmount - b.transitAmount,
                );
                break;
            default:
                combinedFlights.sort(
                    (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
                );
                break;
        }

        return new Response(
            JSON.stringify({
                success: true,
                data: combinedFlights,
            }),
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.SERVER,
            }),
            { status: 500 },
        );
    }
}
