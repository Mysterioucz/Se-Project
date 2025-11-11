import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/purchase:
 *   get:
 *     summary: Get user booking history
 *     description: Retrieve booking history for a specific user, with optional status filtering and pagination
 *     tags:
 *       - Purchase
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: query
 *         description: Filter bookings by ticket status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [SCHEDULED, CANCELLED, DEPARTED]
 *           example: SCHEDULED
 *       - name: page
 *         in: query
 *         description: Page number for pagination (starts at 1)
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *           example: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved booking history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookings:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           paymentId:
 *                             type: string
 *                           paymentDateTime:
 *                             type: string
 *                             format: date-time
 *                           totalAmount:
 *                             type: number
 *                           paymentMethod:
 *                             type: string
 *                           transactionStatus:
 *                             type: string
 *                           flightType:
 *                             type: string
 *                           classType:
 *                             type: string
 *                           adults:
 *                             type: integer
 *                           childrens:
 *                             type: integer
 *                           infants:
 *                             type: integer
 *                           departFlight:
 *                             type: object
 *                             properties:
 *                               flightNo:
 *                                 type: string
 *                               departTime:
 *                                 type: string
 *                                 format: date-time
 *                               arrivalTime:
 *                                 type: string
 *                                 format: date-time
 *                               departureAirport:
 *                                 type: string
 *                               arrivalAirport:
 *                                 type: string
 *                               airlineName:
 *                                 type: string
 *                           returnFlight:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               flightNo:
 *                                 type: string
 *                               departTime:
 *                                 type: string
 *                                 format: date-time
 *                               arrivalTime:
 *                                 type: string
 *                                 format: date-time
 *                               departureAirport:
 *                                 type: string
 *                               arrivalAirport:
 *                                 type: string
 *                               airlineName:
 *                                 type: string
 *                           tickets:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 ticketId:
 *                                   type: string
 *                                 status:
 *                                   type: string
 *                                   enum: [SCHEDULED, CANCELLED, DEPARTED]
 *                                 passengerName:
 *                                   type: string
 *                                 passengerLastName:
 *                                   type: string
 *                                 seatNo:
 *                                   type: string
 *                                 price:
 *                                   type: number
 *                                 serviceFee:
 *                                   type: number
 *                                 flightNo:
 *                                   type: string
 *                                 departTime:
 *                                   type: string
 *                                   format: date-time
 *                                 arrivalTime:
 *                                   type: string
 *                                   format: date-time
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Cannot access other user's data
 *       500:
 *         description: Server error
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ UserAccountID: string }> },
) {
    try {
        // Check authentication
        const session = await getServerSession(nextAuthOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    success: false,
                    message: ErrorMessages.AUTHENTICATION,
                },
                { status: 401 },
            );
        }

        const UserAccountID = session.user.id;

        const { searchParams } = req.nextUrl;

        // Get query parameters
        const statusParam = searchParams.get("status");
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = Math.min(
            100,
            Math.max(1, parseInt(searchParams.get("limit") || "10")),
        );
        const skip = (page - 1) * limit;

        // Validate status parameter if provided
        const validStatuses = ["SCHEDULED", "CANCELLED", "DEPARTED"];
        if (statusParam && !validStatuses.includes(statusParam)) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Invalid status parameter. Must be one of: ${validStatuses.join(", ")}`,
                },
                { status: 400 },
            );
        }

        // Build where clause for tickets
        const ticketWhereClause: any = {};
        if (statusParam) {
            ticketWhereClause.TicketStatus = statusParam;
        }

        // Get total count for pagination
        const totalCount = await prisma.payment.count({
            where: {
                purchase: {
                    some: {
                        UserAccountID,
                        ticket: ticketWhereClause,
                    },
                },
            },
        });

        // Fetch booking history with efficient single query
        const payments = await prisma.payment.findMany({
            where: {
                purchase: {
                    some: {
                        UserAccountID,
                        ticket: ticketWhereClause,
                    },
                },
            },
            include: {
                DepartFlight: {
                    include: {
                        departureAirport: true,
                        arrivalAirport: true,
                    },
                },
                ReturnFlight: {
                    include: {
                        departureAirport: true,
                        arrivalAirport: true,
                    },
                },
                purchase: {
                    where: {
                        UserAccountID,
                    },
                    include: {
                        ticket: true,
                    },
                },
            },
            orderBy: {
                PaymentDateTime: "desc",
            },
            skip,
            take: limit,
        });

        // Filter out payments that don't have any tickets matching the status
        const filteredPayments = payments.filter((payment) => {
            if (!statusParam) return true;
            return payment.purchase.some(
                (purchase) => purchase.ticket.TicketStatus === statusParam,
            );
        });

        // Format the response
        const bookings = filteredPayments.map((payment) => {
            // Filter tickets by status if specified
            const relevantPurchases = statusParam
                ? payment.purchase.filter(
                      (p) => p.ticket.TicketStatus === statusParam,
                  )
                : payment.purchase;

            return {
                paymentId: payment.PaymentID,
                paymentDateTime: payment.PaymentDateTime,
                totalAmount: payment.Amount,
                paymentMethod: payment.PaymentMethod,
                transactionStatus: payment.TransactionStatus,
                flightType: payment.FlightType,
                classType: payment.ClassType,
                adults: payment.Adults,
                childrens: payment.Childrens,
                infants: payment.Infants,
                departFlight: {
                    flightNo: payment.DepartFlight.FlightNo,
                    departTime: payment.DepartFlight.DepartTime,
                    arrivalTime: payment.DepartFlight.ArrivalTime,
                    departureAirport: `${payment.DepartFlight.departureAirport.AirportName} (${payment.DepartFlight.departureAirport.AirportID})`,
                    arrivalAirport: `${payment.DepartFlight.arrivalAirport.AirportName} (${payment.DepartFlight.arrivalAirport.AirportID})`,
                    airlineName: payment.DepartFlight.AirlineName,
                },
                returnFlight: payment.ReturnFlight
                    ? {
                          flightNo: payment.ReturnFlight.FlightNo,
                          departTime: payment.ReturnFlight.DepartTime,
                          arrivalTime: payment.ReturnFlight.ArrivalTime,
                          departureAirport: `${payment.ReturnFlight.departureAirport.AirportName} (${payment.ReturnFlight.departureAirport.AirportID})`,
                          arrivalAirport: `${payment.ReturnFlight.arrivalAirport.AirportName} (${payment.ReturnFlight.arrivalAirport.AirportID})`,
                          airlineName: payment.ReturnFlight.AirlineName,
                      }
                    : null,
                tickets: relevantPurchases.map((purchase) => ({
                    ticketId: purchase.ticket.TicketID,
                    status: purchase.ticket.TicketStatus,
                    passengerName: purchase.ticket.PassengerName,
                    passengerLastName: purchase.ticket.PassengerLastName,
                    seatNo: purchase.ticket.SeatNo,
                    price: purchase.ticket.Price,
                    serviceFee: purchase.ticket.ServiceFee,
                    flightNo: purchase.ticket.FlightNo,
                    departTime: purchase.ticket.DepartTime,
                    arrivalTime: purchase.ticket.ArrivalTime,
                })),
            };
        });

        // Calculate pagination info
        const totalPages = Math.ceil(totalCount / limit);

        return NextResponse.json(
            {
                success: true,
                data: {
                    bookings,
                    pagination: {
                        currentPage: page,
                        totalPages,
                        totalItems: totalCount,
                        itemsPerPage: limit,
                    },
                },
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error fetching booking history:", error);
        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER },
            { status: 500 },
        );
    }
}
