import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(
    req: NextRequest,
) {
    const { AircraftRegNo, FlightNo, DepartTime, ArrivalTime, UserAccountID, Tickets } = await req.json();

    // If accountId doesn't match the token sent's ID
    const session = await getServerSession(nextAuthOptions);
    if (session?.user?.id != UserAccountID) {
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.PERMISSION,
            }),
            { status: 401 }
        );
    }

    if (! AircraftRegNo || ! FlightNo || ! DepartTime || ! ArrivalTime || ! UserAccountID || ! Tickets) {
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.MISSING_PARAMETER,
            }),
            { status: 400 }
        );
    }

    try {
        const createdTickets = await prisma.$transaction(async (tx) => {
            // Create all tickets
            const ticketsCreated = await Promise.all(
                Tickets.map((ticket: any) =>
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
                    UserAccountID,
                    },
                })
                )
            );

            // Decrease AvailableSeat in Flight
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

            // Update Seat availability to false
            await Promise.all(
                Tickets.map((ticket: any) =>
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

            return ticketsCreated;
            });

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    createdTickets: createdTickets
                },
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.SERVER,
            }),
            { status: 500 }
        );
    }
}