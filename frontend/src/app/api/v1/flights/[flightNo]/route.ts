import prisma from "@/db";
import { NextRequest } from "next/server";

// Next.js API route handler for flights
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ flightNo: string }> }
) {
    // If flightNo is provided as a query param, get flight by number
    const { flightNo } = await params;
    try {
        const flight = await prisma.flight.findUnique({
            where: { FlightNo: flightNo },
        });
        if (!flight) {
            return new Response(
                JSON.stringify({
                    success: false,
                    error: `Flight not found with Flight Number ${flightNo}`,
                }),
                { status: 404 }
            );
        }
        return new Response(
            JSON.stringify({
                success: true,
                data: flight,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error",
            }),
            { status: 500 }
        );
    }
}
