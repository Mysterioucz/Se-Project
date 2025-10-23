import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { z } from "zod";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { PaymentMethodSchema, PaymentStatusSchema } from "@/src/enums/Payment";

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

//GET /api/v1/payments?userId=...
// GET /api/v1/payments (no auth check)

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const requestedUserId = url.searchParams.get("userId");

  if (!requestedUserId) {
    return NextResponse.json(
      { success: false, message: "Missing userId query parameter" },
      { status: 400 }
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
      bankName: (p).BankName ?? null,
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
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: unknown) {
    console.error("Error fetching payments:", err);
    return NextResponse.json(
      { success: false, message: ErrorMessages.SERVER },
      { status: 500 }
    );
  }
}
