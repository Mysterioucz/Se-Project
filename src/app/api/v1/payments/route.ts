import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { z } from "zod";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { PaymentMethodSchema, PaymentStatusSchema } from "@/src/enums/Payment";

const CreatePaymentSchema = z
  .object({
    ticketId: z.string().trim().min(1, "ticketId is required"),
    amount: z.number().positive("amount must be > 0"),
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
    const accountId = String(session.user.id);

    try {
      
        const { ticketId, amount, method, status, paymentEmail, paymentTelNo, bankName } =
      CreatePaymentSchema.parse(await request.json());

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
          PaymentMethod: method,           
          TransactionStatus: status, 
          PaymentEmail: paymentEmail,
          PaymentTelNo: paymentTelNo,      
          Amount: amount,
          BankName: method === "ONLINE_BANKING" ? bankName : null,                  

        },
      });

      const purchase = await tx.purchase.create({
        data: {
          TicketID: ticketId,
          PaymentID: payment.PaymentID,
          UserAccountID: accountId,
        },
      });

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
            email: result.payment.PaymentEmail,
            telNo: result.payment.PaymentTelNo,
            amount: result.payment.Amount,
          },
          purchase: {
            ticketId,
            paymentId: result.payment.PaymentID,
            userAccountId: accountId,
          },
        },
      },
      { status: 201, headers: { Location: `/api/v1/payments/${paymentId}` } }
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