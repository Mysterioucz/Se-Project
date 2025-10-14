import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { z } from "zod";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { PaymentMethodSchema, PaymentStatusSchema } from "@/src/enums/Payment";

const CreatePaymentSchema = z.object({
  ticketId: z.string().min(1, "ticketId is required"),
  amount: z.number().positive("amount must be > 0"),
  method: PaymentMethodSchema,
  status: PaymentStatusSchema.default("PAID")
});

export async function POST(request: NextRequest, 
    { params }: { params: { accountId: string } }) {
        //check if the user is already logged in
        const { accountId } = params;
        const session = await getServerSession(nextAuthOptions);
        if (!session?.user?.id || String(session.user.id) !== accountId) {
            return NextResponse.json(
                { error: {message: ErrorMessages.AUTHENTICATION} },
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
                { error: {code: "TICKET_NOT_FOUND", message: "Ticket not found." } },
                { status: 404}
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

      if (status === "PAID") {
        await tx.ticket.update({
          where: { TicketID: ticketId },
          data: { TicketStatus: "PAID" }, 
        });
      }

      return { payment, purchase };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          payment: {
            id: result.payment.PaymentID,
            dateTime: result.payment.PaymentDateTime,
            method: result.payment.PaymentMethod,
            status: result.payment.TransactionStatus,
            amount: result.payment.Amount,
          },
          purchase: { ticketId, paymentId: result.payment.PaymentID, userAccountId: accountId },
        },
      },
      { status: 201, headers: {Location: `/api/v1/payments/${paymentId}` } }
    );
        
    } catch (err: any) {
        if (err?.name === "ZodError") {
            return NextResponse.json(
                { success: false, message: "Validation error", details: err.errors },
                { status: 400 }
            );
        }
        if (err?.code === "P2002") {
            return NextResponse.json(
                { success: false, message: "Duplicate payment or purchase." },
                { status: 409 }
            );
        }
        return NextResponse.json (
            { success: false, message: ErrorMessages.SERVER, details: err.message },
            { status: 500 }
        )
    }
}