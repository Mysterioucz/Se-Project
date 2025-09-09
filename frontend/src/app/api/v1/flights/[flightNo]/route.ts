import prisma from "@/db";
import type { NextApiRequest, NextApiResponse } from "next";

// Next.js API route handler for flights
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        // If flightNo is provided as a query param, get flight by number
        const flightNo = req.query.flightNo as string | undefined;
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
    } else {
        return new Response(
            JSON.stringify({ success: false, error: "Method Not Allowed" }),
            { status: 405 }
        );
    }
}
