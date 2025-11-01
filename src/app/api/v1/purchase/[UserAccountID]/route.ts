import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ UserAccountID: string }> },
) {
    try {
        const { UserAccountID } = await params;

        // --- 1. Get all purchases for this user ---
        const purchases = await prisma.purchase.findMany({
            where: { UserAccountID },
            select: { PaymentID: true, TicketID: true },
        });

        if (purchases.length === 0) {
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        // --- 2. Group tickets by payment ---
        const grouped = purchases.reduce((acc, p) => {
            if (!acc[p.PaymentID]) acc[p.PaymentID] = [];
            acc[p.PaymentID].push(p.TicketID);
            return acc;
        }, {} as Record<string, string[]>);

        // --- 3. Build results ---
        const results = await Promise.all(
            Object.entries(grouped).map(async ([paymentID, ticketIDs]) => {
                const tickets = await prisma.ticket.findMany({
                    where: { TicketID: { in: ticketIDs } },
                    select: { TicketStatus: true }
                });

                const TicketStatus = tickets[0]?.TicketStatus;

                // 4. Fetch payment (now contains flight info)
                const payment = await prisma.payment.findUnique({
                where: { PaymentID: paymentID },
                select: {
                    Amount: true,
                    Adults: true,
                    Childrens: true,
                    Infants: true,
                    ClassType: true,
                    FlightType: true,
                    DepartFlightNo: true,
                    DepartFlightDepartTime: true,
                    DepartFlightArrivalTime: true,
                    ReturnFlightNo: true,
                    ReturnFlightDepartTime: true,
                    ReturnFlightArrivalTime: true,
                },
                });

                if (!payment) return null;

                const {
                    DepartFlightNo,
                    DepartFlightDepartTime,
                    DepartFlightArrivalTime,
                    ReturnFlightNo,
                    ReturnFlightDepartTime,
                    ReturnFlightArrivalTime,
                } = payment;

                // --- 5. Look up departure flight info ---
                let DepartFlightDepartAirport: string | null = null;
                let DepartFlightArrivalAirport: string | null = null;
                let DepartFlightDepartCity: string | null = null;
                let DepartFlightArrivalCity: string | null = null;

                const departFlight = await prisma.flight.findFirst({
                        where: {
                            FlightNo: DepartFlightNo,
                            DepartTime: DepartFlightDepartTime,
                            ArrivalTime: DepartFlightArrivalTime,
                        },
                        select: {
                            DepartureAirportID: true,
                            ArrivalAirportID: true,
                        },
                    });

                    if (departFlight) {
                    DepartFlightDepartAirport = departFlight.DepartureAirportID;
                    DepartFlightArrivalAirport = departFlight.ArrivalAirportID;

                    // Look up cities
                    const [departAirport, arriveAirport] = await Promise.all([
                        prisma.airport.findUnique({
                            where: { AirportID: departFlight.DepartureAirportID },
                            select: { City: true },
                        }),
                        prisma.airport.findUnique({
                            where: { AirportID: departFlight.ArrivalAirportID },
                            select: { City: true },
                        }),
                    ]);

                    DepartFlightDepartCity = departAirport?.City ?? null;
                    DepartFlightArrivalCity = arriveAirport?.City ?? null;
                }

                // --- 6. Look up return flight info (if not null) ---
                let ReturnFlightDepartAirport: string | null = null;
                let ReturnFlightArrivalAirport: string | null = null;
                let ReturnFlightDepartCity: string | null = null;
                let ReturnFlightArrivalCity: string | null = null;

                if (ReturnFlightNo && ReturnFlightDepartTime && ReturnFlightArrivalTime) {
                    const returnFlight = await prisma.flight.findFirst({
                        where: {
                            FlightNo: ReturnFlightNo,
                            DepartTime: ReturnFlightDepartTime,
                            ArrivalTime: ReturnFlightArrivalTime,
                        },
                        select: {
                            DepartureAirportID: true,
                            ArrivalAirportID: true,
                        },
                    });

                    if (returnFlight) {
                        ReturnFlightDepartAirport = returnFlight.DepartureAirportID;
                        ReturnFlightArrivalAirport = returnFlight.ArrivalAirportID;

                        const [returnDepartAirport, returnArriveAirport] = await Promise.all([
                            prisma.airport.findUnique({
                                where: { AirportID: returnFlight.DepartureAirportID },
                                select: { City: true },
                            }),
                            prisma.airport.findUnique({
                                where: { AirportID: returnFlight.ArrivalAirportID },
                                select: { City: true },
                            }),
                        ]);

                        ReturnFlightDepartCity = returnDepartAirport?.City ?? null;
                        ReturnFlightArrivalCity = returnArriveAirport?.City ?? null;
                    }
                }

                return {
                    PaymentID: paymentID,
                    Amount: payment?.Amount ?? 0,
                    Adults: payment?.Adults,
                    Childrens: payment?.Childrens,
                    Infants: payment?.Infants,
                    ClassType: payment?.ClassType,
                    FlightType: payment?.FlightType,
                    DepartFlightNo,
                    DepartFlightDepartTime,
                    DepartFlightArrivalTime,
                    DepartFlightDepartAirport,
                    DepartFlightArrivalAirport,
                    DepartFlightDepartCity,
                    DepartFlightArrivalCity,
                    ReturnFlightNo,
                    ReturnFlightDepartTime,
                    ReturnFlightArrivalTime,
                    ReturnFlightDepartAirport,
                    ReturnFlightArrivalAirport,
                    ReturnFlightDepartCity,
                    ReturnFlightArrivalCity,
                    TicketStatus,
                    tickets,
                };
            })
        );

        const data = results.filter(Boolean);

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: ErrorMessages.SERVER },
            { status: 500 },
        );
    }
}
