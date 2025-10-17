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
  status: PaymentStatusSchema.default("PAID"),
  email: z.string().email("paymentEmail must be a valid email"),
  telNo: z.string().min(1, "paymentTelNo is required"),
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
    const accountId = String(session.user.id);

    try {
        const body = CreatePaymentSchema.parse(await request.json());
        const { ticketId, amount, method, status, email, telNo } = body;

        //Validate entities (ticket exists, not already purchased)
        const ticket = await prisma.ticket.findUnique({ where: { TicketID: ticketId } });
        if (!ticket) {
            return NextResponse.json(
                { error: {code: "TICKET_NOT_FOUND", message:ErrorMessages.NOT_FOUND } },
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
          PaymentEmail: email,
          PaymentTelNo: telNo,
        },
      });

      const purchase = await tx.purchase.create({
        data: {
          TicketID: ticketId,
          PaymentID: payment.PaymentID,
          UserAccountID: accountId,
        },
      });

      //Update ticket status if payment is successful
      //need to resolve enum issue concerning TicketStatus later
      // if (status === "PAID") {
      //   await tx.ticket.update({
      //     where: { TicketID: ticketId },
      //     data: { TicketStatus: "PAID" }, 
      //   });
      // }

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