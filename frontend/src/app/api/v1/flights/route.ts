import prisma from "@/db";
import type { NextApiRequest, NextApiResponse } from "next";

// Next.js API route handler for flights
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
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
    } else {
        return new Response(
            JSON.stringify({ success: false, error: "Method Not Allowed" }),
            { status: 405 }
        );
    }
}
