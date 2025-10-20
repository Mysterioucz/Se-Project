import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { z } from "zod";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { PaymentMethodSchema, PaymentStatusSchema } from "@/src/enums/Payment";
import { Flight } from "@mui/icons-material";
import { datetimeRegex } from "zod/v3";

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
    BaggageChecked: z.number().nonnegative(),
    BaggageCabin: z.number().nonnegative(),
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
        Tickets: z.array(TicketInputSchema).min(1, "At least one ticket required"),

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
        FlightType: z.string(),
        DepartFlightNo: z.string(),
        DepartFlightDepartTime: z.date(),
        DepartFlightArrivalTime: z.date(),
        ReturnFlightNo: z.string(),
        ReturnFlightDepartTime: z.date(),
        ReturnFlightArrivalTime: z.date(),
        DepartFlightCabinClass: z.string(),
        ReturnFlightCabinClass: z.string()
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
            { status: 401 }
        );
    }

    // The accountId is securely obtained from the session object.
    const UserAccountID = String(session.user.id);
    
    try {
        const parsed = CreatePaymentSchema.parse(await request.json());
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
            FlightType,
            DepartFlightNo,
            DepartFlightDepartTime,
            DepartFlightArrivalTime,
            DepartFlightCabinClass,
            ReturnFlightNo,
            ReturnFlightDepartTime,
            ReturnFlightArrivalTime,
            ReturnFlightCabinClass
        } = parsed;
        
        // As the tickets were never created, we don't need this
        // Validate entities (ticket exists, not already purchased)
        // const ticket = await prisma.ticket.findUnique({ where: { TicketID: ticketId } });
        // if (!ticket) {
        //     return NextResponse.json(
        //         { error: {code: "TICKET_NOT_FOUND", message:ErrorMessages.NOT_FOUND } },
        //         { status: 404}
        //     );
        // }

        // const existingPurchase = await prisma.purchase.findUnique({
        //     where: { TicketID: ticketId }, 
        // });
        
        // if (existingPurchase) {
        //     return NextResponse.json(
        //         { error: { code: "ALREADY_PURCHASED", message: "Ticket already purchased." } },
        //         { status: 409 }
        //     );
        // }

        // Create payment and purchase 
        const paymentId = `pay_${crypto.randomUUID()}`;

        const result = await prisma.$transaction(async (tx) => {
            // Create tickets
            const createdTickets = await Promise.all(
                Tickets.map((ticket) =>
                tx.ticket.create({
                    data: {
                        TicketID: `tic_${crypto.randomUUID()}`,
                        Price: ticket.Price,
                        ServiceFee: ticket.ServiceFee ?? 0,
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
                })
                )
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
                })
                )
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
                    FlightType: FlightType,
                    DepartFlightNo: DepartFlightNo,
                    DepartFlightDepartTime: DepartFlightDepartTime,
                    DepartFlightArrivalTime: DepartFlightArrivalTime,
                    ReturnFlightNo: ReturnFlightNo,
                    ReturnFlightDepartTime: ReturnFlightDepartTime,
                    ReturnFlightArrivalTime: ReturnFlightArrivalTime,
                    DepartFlightCabinClass: DepartFlightCabinClass,
                    ReurnFlightCabinClass: ReturnFlightCabinClass
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
                })
                )
            );

            return { payment, createdTickets, purchases };
        });

        return NextResponse.json({
            success: true,
            data: {
                payment: result.payment,
                tickets: result.createdTickets,
                purchases: result.purchases,
            },
        },{ 
            status: 201, 
            headers: { 
                Location: `/api/v1/payments/${paymentId}` 
            } 
        });

    } catch (err: unknown) {
        if (err instanceof z.ZodError) {
          return NextResponse.json(
            {
              success: false,
              message: "Validation error",
              details: err.issues,
            },
            { status: 400 }
          );
        }
    
      return NextResponse.json(
        { success: false, message: ErrorMessages.SERVER},
        { status: 500 }
      );
    }
}