import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { PaymentMethodSchema, PaymentStatusSchema } from "@/src/enums/Payment";

const CreatePaymentSchema = z.object({
  ticketId: z.string().min(1, "ticketId is required"),
  userAccountId: z.string().min(1, "userAccountId is required"),
  amount: z.number().positive("amount must be > 0"),
  method: PaymentMethodSchema,
  status: PaymentStatusSchema.default("PAID")
});

export async function POST(request: NextRequest, 
    { params }: { params: { accountId: string } }) {
        //check if the user is already logged in
        const { accountId } = await params;
        const session = await getServerSession(nextAuthOptions);
        if (session?.user.id != accountId) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: ErrorMessages.AUTHENTICATION,
                }),
                { status: 401 }
            );
        }

    try {

        const body = CreatePaymentSchema.parse(await request.json());
        const { ticketId, amount, method, status } = body;

        //Validate entities (ticket exists, not already purchased)
        const ticket = await prisma.ticket.findUnique({ where: { TicketID: ticketId } });
        if (!ticket) {
            return NextResponse.json(
                { error: { code: "TICKET_NOT_FOUND", message: "Ticket not found." } },
                { status: 404 }
            );
        }

        const existingPurchase = await prisma.purchase.findUnique({
            where: { TicketID: ticketId }, 
        });
        
        if (existingPurchase) {
            return NextResponse.json(
                { error: { code: "ALREADY_PURCHASED", message: "Ticket already purchased." } },
                { status: 409 }
            );
        }

    //Create payment and purchase 
    const paymentId = `pay_${crypto.randomUUID()}`;

    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          PaymentID: paymentId,
          PaymentDateTime: new Date(),
          PaymentMethod: method,           //STRING 
          TransactionStatus: status,       //STRING 
          Amount: amount,                  //Float
        },
      });

      const purchase = await tx.purchase.create({
        data: {
          TicketID: ticketId,
          PaymentID: payment.PaymentID,
          UserAccountID: accountId,
        },
      });

    //   if (status === "PAID") {
    //     await tx.ticket.update({
    //       where: { TicketID: ticketId },
    //       data: { TicketStatus: "PAID" }, 
    //     });
    //   }

      return { payment, purchase };
    });

    return new Response(
            JSON.stringify({
                success: true,
                data: {
                    payment: {
                    id: result.payment.PaymentID,
                    dateTime: result.payment.PaymentDateTime,
                    method: result.payment.PaymentMethod,
                    status: result.payment.TransactionStatus,
                    amount: result.payment.Amount,
                }, 
                purchase: {
                    ticketId,
                    paymentId: result.payment.PaymentID,
                    userAccountId: accountId,
                }
            },
            }),
            { status: 201}
        );
        
    } catch (err: any) {

    }
}