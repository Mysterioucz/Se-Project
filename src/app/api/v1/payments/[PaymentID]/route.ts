import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/payments/{paymentId}:
 *   get:
 *     summary: Get payment details by payment ID
 *     description: Retrieve payment information and associated tickets by payment ID (requires authentication)
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paymentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment ID
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - user doesn't own this payment
 *       404:
 *         description: Payment not found
 *       500:
 *         description: Server error
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ PaymentID: string }> },
) {
    try {
        // Authenticate user
        const session = await getServerSession(nextAuthOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: { message: ErrorMessages.AUTHENTICATION } },
                { status: 401 },
            );
        }

        const UserAccountID = String(session.user.id);
        const { PaymentID } = await params;

        // Find the payment
        const payment = await prisma.payment.findUnique({
            where: {
                PaymentID: PaymentID,
            },
            include: {
                purchase: true,
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
            },
        });

        if (!payment) {
            return NextResponse.json(
                { success: false, message: "Payment not found" },
                { status: 404 },
            );
        }

        // Verify that the user owns this payment
        const userOwnsPayment = payment.purchase.some(
            (p) => p.UserAccountID === UserAccountID,
        );

        if (!userOwnsPayment) {
            return NextResponse.json(
                { success: false, message: ErrorMessages.PERMISSION },
                { status: 403 },
            );
        }

        // Get all purchases and tickets for this payment
        const purchases = await prisma.purchase.findMany({
            where: {
                PaymentID: payment.PaymentID,
            },
            include: {
                ticket: {
                    select: {
                        TicketID: true,
                        Price: true,
                        ServiceFee: true,
                        TicketStatus: true,
                        PassengerName: true,
                        PassengerLastName: true,
                        Gender: true,
                        DateOfBirth: true,
                        Nationality: true,
                        SeatNo: true,
                        BaggageChecked: true,
                        BaggageCabin: true,
                        PassportNo: true,
                        PassportExpiry: true,
                        FlightNo: true,
                        DepartTime: true,
                        ArrivalTime: true,
                    },
                },
            },
        });

        const tickets = purchases.map((p) => p.ticket);

        const paymentData = {
            PaymentID: payment.PaymentID,
            PaymentDateTime: payment.PaymentDateTime,
            PaymentMethod: payment.PaymentMethod,
            TransactionStatus: payment.TransactionStatus,
            PaymentEmail: payment.PaymentEmail,
            PaymentTelNo: payment.PaymentTelNo,
            BankName: payment.BankName ?? null,
            Amount: payment.Amount,
            CreatedAt: payment.CreatedAt,
            Adults: payment.Adults,
            Childrens: payment.Childrens,
            Infants: payment.Infants,
            ClassType: payment.ClassType,
            FlightType: payment.FlightType,
            DepartFlight: payment.DepartFlight,
            ReturnFlight: payment.ReturnFlight ?? null,
        };

        return NextResponse.json(
            {
                success: true,
                data: {
                    payment: paymentData,
                    tickets,
                },
            },
            { status: 200, headers: { "Cache-Control": "no-store" } },
        );
    } catch (err: unknown) {
        console.error("Error fetching payment by ID:", err);
        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER },
            { status: 500 },
        );
    }
}
