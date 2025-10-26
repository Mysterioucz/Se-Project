import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { PaymentMethodSchema, PaymentStatusSchema } from "@/src/enums/Payment";
import { nextAuthOptions } from "@/src/lib/auth";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * @swagger
 * /api/v1/payments:
 *   post:
 *     summary: Create payment and tickets
 *     description: Create payment transaction, generate tickets, and mark seats as unavailable (requires authentication)
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - AircraftRegNo
 *               - FlightNo
 *               - DepartTime
 *               - ArrivalTime
 *               - Tickets
 *               - totalAmount
 *               - method
 *               - paymentEmail
 *               - paymentTelNo
 *             properties:
 *               AircraftRegNo:
 *                 type: string
 *                 example: TG-001
 *               FlightNo:
 *                 type: string
 *                 example: TG101
 *               DepartTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-01T10:00:00Z
 *               ArrivalTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-01T14:00:00Z
 *               Tickets:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - Price
 *                     - PassengerName
 *                     - PassengerLastName
 *                     - Gender
 *                     - DateOfBirth
 *                     - Nationality
 *                     - SeatNo
 *                   properties:
 *                     Price:
 *                       type: number
 *                       example: 5000
 *                     ServiceFee:
 *                       type: number
 *                       example: 200
 *                     PassengerName:
 *                       type: string
 *                       example: John
 *                     PassengerLastName:
 *                       type: string
 *                       example: Doe
 *                     Gender:
 *                       type: string
 *                       example: Male
 *                     DateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: 1990-01-01
 *                     Nationality:
 *                       type: string
 *                       example: Thai
 *                     BaggageChecked:
 *                       type: number
 *                       default: 10
 *                       example: 20
 *                     BaggageCabin:
 *                       type: number
 *                       default: 7
 *                       example: 7
 *                     SeatNo:
 *                       type: string
 *                       example: 12A
 *               totalAmount:
 *                 type: number
 *                 example: 10000
 *               method:
 *                 type: string
 *                 enum: [CREDIT_CARD, DEBIT_CARD, ONLINE_BANKING]
 *                 example: CREDIT_CARD
 *               status:
 *                 type: string
 *                 enum: [PAID, PENDING, FAILED]
 *                 default: PAID
 *                 example: PAID
 *               paymentEmail:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               paymentTelNo:
 *                 type: string
 *                 pattern: ^[0-9+\-()\s]+$
 *                 example: +66812345678
 *               bankName:
 *                 type: string
 *                 description: Required when method is ONLINE_BANKING
 *                 example: Bangkok Bank
 *     responses:
 *       201:
 *         description: Payment created successfully
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
 *                     payment:
 *                       type: object
 *                     tickets:
 *                       type: array
 *                       items:
 *                         type: object
 *                     purchases:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get user payments
 *     description: Retrieve payment history for a specific user
 *     tags:
 *       - Payments
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: User account ID
 *         required: true
 *         schema:
 *           type: string
 *           example: acc_123456
 *     responses:
 *       200:
 *         description: Successfully retrieved payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       dateTime:
 *                         type: string
 *                         format: date-time
 *                       method:
 *                         type: string
 *                       status:
 *                         type: string
 *                       email:
 *                         type: string
 *                       telNo:
 *                         type: string
 *                       bankName:
 *                         type: string
 *                         nullable: true
 *                       amount:
 *                         type: number
 *                       purchase:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           ticketId:
 *                             type: string
 *                           userAccountId:
 *                             type: string
 *       400:
 *         description: Missing userId parameter
 *       500:
 *         description: Server error
 */
const TicketInputSchema = z.object({
    Price: z.number().positive(),
    ServiceFee: z.number().optional(),
    PassengerName: z.string().min(1),
    PassengerLastName: z.string().min(1),
    Gender: z.string().min(1),
    DateOfBirth: z.string().refine((v) => !isNaN(Date.parse(v)), {
        message: "Invalid date",
    }),
    Nationality: z.string().min(1),
    BaggageChecked: z.number().nonnegative().default(10),
    BaggageCabin: z.number().nonnegative().default(7),
    SeatNo: z.string().min(1),
});

const CreatePaymentSchema = z
    .object({
        AircraftRegNo: z.string().min(1),
        FlightNo: z.string().min(1),
        DepartTime: z.string().refine((v) => !isNaN(Date.parse(v)), {
            message: "Invalid DepartTime",
        }),
        ArrivalTime: z.string().refine((v) => !isNaN(Date.parse(v)), {
            message: "Invalid ArrivalTime",
        }),
        Tickets: z
            .array(TicketInputSchema)
            .min(1, "At least one ticket required"),

        totalAmount: z.number().positive("amount must be > 0"),
        method: PaymentMethodSchema,
        status: PaymentStatusSchema.default("PAID"),

        paymentEmail: z.email("valid email required"),

        paymentTelNo: z
            .string()
            .trim()
            .min(5, "tel too short")
            .max(20, "tel too long")
            .regex(/^[0-9+\-()\s]+$/, "tel format invalid"),

        bankName: z
            .string()
            .trim()
            .min(2, "bankName must be at least 2 characters")
            .optional()
            .transform((v) => (v === "" ? undefined : v)),
    })
    .superRefine((v, ctx) => {
        // Require bankName when method is ONLINE_BANKING
        if (v.method === "ONLINE_BANKING" && !v.bankName) {
            ctx.addIssue({
                path: ["bankName"],
                code: z.ZodIssueCode.custom,
                message: "bankName is required when method is ONLINE_BANKING",
            });
        }
    });

export async function POST(request: NextRequest) {
    //check if the user is already logged in
    const session = await getServerSession(nextAuthOptions);
    if (!session?.user?.id) {
        return NextResponse.json(
            { error: { message: ErrorMessages.AUTHENTICATION } },
            { status: 401 },
        );
    }

    // The accountId is securely obtained from the session object.
    const UserAccountID = String(session.user.id);

    try {
        const parsed = CreatePaymentSchema.parse(await request.json());
        console.log("Parsed payment data:", parsed);
        const {
            AircraftRegNo,
            FlightNo,
            DepartTime,
            ArrivalTime,
            Tickets,
            totalAmount,
            method,
            status,
            paymentEmail,
            paymentTelNo,
            bankName,
        } = parsed;

        // Create payment and purchase
        const paymentId = `pay_${randomUUID()}`;

        const result = await prisma.$transaction(
            async (tx) => {
                // Create tickets
                const createdTickets = await Promise.all(
                    Tickets.map((ticket) =>
                        tx.ticket.create({
                            data: {
                                Price: ticket.Price,
                                ServiceFee: ticket.ServiceFee,
                                PassengerName: ticket.PassengerName,
                                PassengerLastName: ticket.PassengerLastName,
                                Gender: ticket.Gender,
                                DateOfBirth: new Date(ticket.DateOfBirth),
                                Nationality: ticket.Nationality,
                                BaggageChecked: ticket.BaggageChecked,
                                BaggageCabin: ticket.BaggageCabin,
                                SeatNo: ticket.SeatNo,
                                AircraftRegNo,
                                FlightNo,
                                DepartTime: new Date(DepartTime),
                                ArrivalTime: new Date(ArrivalTime),
                            },
                        }),
                    ),
                );

                // Decrease available seats
                await tx.flight.updateMany({
                    where: {
                        FlightNo,
                        DepartTime: new Date(DepartTime),
                        ArrivalTime: new Date(ArrivalTime),
                    },
                    data: {
                        AvailableSeat: {
                            decrement: Tickets.length,
                        },
                    },
                });

                // Mark seats unavailable
                await Promise.all(
                    Tickets.map((ticket) =>
                        tx.seat.updateMany({
                            where: {
                                FlightNo,
                                DepartTime: new Date(DepartTime),
                                ArrivalTime: new Date(ArrivalTime),
                                SeatNo: ticket.SeatNo,
                            },
                            data: {
                                IsAvailable: false,
                            },
                        }),
                    ),
                );

                // Create Payment
                const payment = await tx.payment.create({
                    data: {
                        PaymentID: paymentId,
                        PaymentDateTime: new Date(),
                        PaymentMethod: method,
                        TransactionStatus: status,
                        PaymentEmail: paymentEmail,
                        PaymentTelNo: paymentTelNo,
                        Amount: totalAmount,
                        BankName: method === "ONLINE_BANKING" ? bankName : null,
                    },
                });

                // Create purchases for all tickets
                const purchases = await Promise.all(
                    createdTickets.map((ticket) =>
                        tx.purchase.create({
                            data: {
                                TicketID: ticket.TicketID,
                                PaymentID: payment.PaymentID,
                                UserAccountID,
                            },
                        }),
                    ),
                );

                return { payment, createdTickets, purchases };
            },
            {
                maxWait: 5000,
                timeout: 10000,
            },
        );

        return NextResponse.json(
            {
                success: true,
                data: {
                    payment: result.payment,
                    tickets: result.createdTickets,
                    purchases: result.purchases,
                },
            },
            {
                status: 201,
                headers: {
                    Location: `/api/v1/payments/${paymentId}`,
                },
            },
        );
    } catch (err: unknown) {
        if (err instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validation error",
                    details: err.issues,
                },
                { status: 400 },
            );
        }

        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER, details: err },
            { status: 500 },
        );
    }
}

//GET /api/v1/payments?userId=...
// GET /api/v1/payments (no auth check)

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const requestedUserId = url.searchParams.get("userId");

    if (!requestedUserId) {
        return NextResponse.json(
            { success: false, message: "Missing userId query parameter" },
            { status: 400 },
        );
    }

    try {
        const payments = await prisma.payment.findMany({
            where: {
                purchase: {
                    UserAccountID: requestedUserId,
                },
            },
            orderBy: { PaymentDateTime: "desc" },
            include: {
                purchase: true,
            },
        });

        const data = payments.map((p) => ({
            id: p.PaymentID,
            dateTime: p.PaymentDateTime,
            method: p.PaymentMethod,
            status: p.TransactionStatus,
            email: p.PaymentEmail,
            telNo: p.PaymentTelNo,
            bankName: p.BankName ?? null,
            amount: p.Amount,
            purchase: p.purchase
                ? {
                      ticketId: p.purchase.TicketID,
                      userAccountId: p.purchase.UserAccountID,
                  }
                : null,
        }));

        return NextResponse.json(
            { success: true, data },
            { status: 200, headers: { "Cache-Control": "no-store" } },
        );
    } catch (err: unknown) {
        console.error("Error fetching payments:", err);
        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER },
            { status: 500 },
        );
    }
}
