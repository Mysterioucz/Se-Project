import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: { UserAccountID: string };
}

export async function GET(req: NextRequest, { params }: Params) {
    const requestedUserId = params.UserAccountID;

    if (! requestedUserId) {
        return NextResponse.json(
        { success: false, message: ErrorMessages.MISSING_PARAMETER },
        { status: 400 }
        );
    }

    try {
        // Find all PaymentIDs for this user
        const purchaseRecords = await prisma.purchase.findMany({
            where: { UserAccountID: requestedUserId },
            select: { PaymentID: true },
        });

        const paymentIds = purchaseRecords.map((p) => p.PaymentID);
        if (paymentIds.length === 0) {
            return NextResponse.json({ success: true, data: null }, { status: 200 });
        }

        // Get the latest payment with nested Depart/Return flight + airport info
        const latestPayment = await prisma.payment.findFirst({
        where: { PaymentID: { in: paymentIds } },
        orderBy: { createdAt: "desc" },
        include: {
            DepartFlight: {
            include: {
                departureAirport: { select: { AirportName: true } },
                arrivalAirport: { select: { AirportName: true } },
            },
            },
            ReturnFlight: {
            include: {
                departureAirport: { select: { AirportName: true } },
                arrivalAirport: { select: { AirportName: true } },
            },
            },
        },
        });

        if (!latestPayment) {
            return NextResponse.json({ success: true, data: null }, { status: 200 });
        }

        // Find all TicketIDs for this PaymentID
        const ticketsLinked = await prisma.purchase.findMany({
            where: { PaymentID: latestPayment.PaymentID },
            select: { TicketID: true },
        });

        const ticketIds = ticketsLinked.map((t) => t.TicketID);

        // Lookup Ticket details
        const tickets = await prisma.ticket.findMany({
        where: { TicketID: { in: ticketIds } },
            select: {
                Price: true,
                ServiceFee: true,
                PassengerName: true,
                PassengerLastName: true,
                Gender: true,
                DateOfBirth: true,
                Nationality: true,
                BaggageChecked: true,
                BaggageCabin: true,
                SeatNo: true,
                AircraftRegNo: true,
            }
        });

    // Combine response
    const result = {
        payment: latestPayment,
        tickets: tickets,
    };

    return NextResponse.json(
      { success: true, data: result },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
    } catch (err) {
        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER },
            { status: 500 }
        );
    }
}