import prisma from "@/db";
import { NextRequest } from "next/server";

// Next.js API route handler for flights
export async function GET(req: NextRequest) {
    // all flights
    try {
        const flights = await prisma.flight.findMany();
        return new Response(
            JSON.stringify({
                success: true,
                count: flights.length,
                data: flights,
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
