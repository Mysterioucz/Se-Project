import prisma from "@/db";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

//@desc     Get airports
//@route    GET /api/v1/airports
//@access   Public
export const GET = async () => {
    try {
        const airports = await prisma.airport.findMany();

        return new Response(
            JSON.stringify({
                success: true,
                data: airports,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error" }), {
            status: 500,
        });
    }
};

//@desc     Create an airport
//@route    POST /api/v1/airports
//@access   Private
export const POST = async (req: NextRequest) => {
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Not authorized to access this route",
            }),
            { status: 401 }
        );
    }

    const { AirportID, AirportName, City, Country } = await req.json();

    if (!AirportID || !AirportName || !City || !Country) {
        return new Response(
            JSON.stringify({
                message: "Please provide all required parameters",
            }),
            { status: 400 }
        );
    }

    try {
        const newAirport = await prisma.airport.create({
            data: {
                AirportID,
                AirportName,
                City,
                Country,
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: newAirport,
            }),
            { status: 200 }
        );
    } catch (err) {
        return new Response(JSON.stringify({ message: err }), {
            status: 500,
        });
    }
};
