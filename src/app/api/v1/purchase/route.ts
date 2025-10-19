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
        const createdTickets = await prisma.ticket.createMany({
            data: Tickets.map((ticket: any) => ({
                Price: ticket.price,
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
            })),
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    createdCount: createdTickets.count,
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