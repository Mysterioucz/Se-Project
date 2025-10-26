import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/flights/lookup:
 *   get:
 *     summary: Get flight details with services and seats
 *     description: Retrieve additional services and seat availability for a specific flight
 *     tags:
 *       - Flights
 *     parameters:
 *       - name: flightNo
 *         in: query
 *         description: Flight number
 *         required: true
 *         schema:
 *           type: string
 *           example: TG123
 *       - name: departTime
 *         in: query
 *         description: Departure time in ISO 8601 format
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-09-27T01:25:20.000Z
 *       - name: arrivalTime
 *         in: query
 *         description: Arrival time in ISO 8601 format
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-09-27T03:45:20.000Z
 *     responses:
 *       200:
 *         description: Successfully retrieved flight details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     services:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["Select Seat", "Extra Baggage"]
 *                     availableSeats:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           SeatNo:
 *                             type: string
 *                           SeatType:
 *                             type: string
 *                           IsAvailable:
 *                             type: boolean
 *                     flight:
 *                       type: object
 *                       properties:
 *                         FlightNo:
 *                           type: string
 *                         DepartTime:
 *                           type: string
 *                           format: date-time
 *                         ArrivalTime:
 *                           type: string
 *                           format: date-time
 *                         AirlineName:
 *                           type: string
 *                         DepartureAirportID:
 *                           type: string
 *                         ArrivalAirportID:
 *                           type: string
 *       400:
 *         description: Missing required parameters
 *       404:
 *         description: Flight not found
 *       500:
 *         description: Server error
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const flightNo = searchParams.get("flightNo");
        const departTime = searchParams.get("departTime"); // format : 2025-09-27T01:25:20.000Z
        const arrivalTime = searchParams.get("arrivalTime");

        if (!flightNo || !departTime || !arrivalTime) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    error: ErrorMessages.MISSING_PARAMETER,
                }),
                { status: 400 },
            );
        }

        const flight = await prisma.flight.findUnique({
            where: {
                FlightNo_DepartTime_ArrivalTime: {
                    FlightNo: flightNo,
                    DepartTime: departTime,
                    ArrivalTime: arrivalTime,
                },
            },
            select: {
                AircraftRegNo: true,
                FlightNo: true,
                DepartTime: true,
                ArrivalTime: true,
                AirlineName: true,
                availableServices: {
                    select: {
                        service: true,
                    },
                },
                seats: {
                    // It should retrieve both available and unavailable
                    // where: {
                    //   IsAvailable: true
                    // },
                    select: {
                        SeatNo: true,
                        SeatType: true,
                        IsAvailable: true,
                    },
                },
                arrivalAirport: true,
                departureAirport: true,
                ArrivalAirportID: true,
                DepartureAirportID: true,
            },
        });

        if (!flight) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    error: ErrorMessages.NOT_FOUND,
                }),
                { status: 404 },
            );
        }

        const services = flight.availableServices.map(
            (s) => s.service.ServiceName,
        );

        const responseData = {
            services,
            ...(services.includes("Select Seat") && {
                availableSeats: flight.seats || [],
            }),
            flight,
        };

        return new NextResponse(
            JSON.stringify({
                success: true,
                data: responseData,
            }),
            { status: 200 },
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: ErrorMessages.SERVER,
            }),
            { status: 500 },
        );
    }
}
