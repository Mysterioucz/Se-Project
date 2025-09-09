import prisma from "@/db";
import { NextApiRequest, NextApiResponse } from "next";

//@desc     Get airports
//@route    GET /api/v1/airports
//@access   Public
export const GET = async () => {
    try {
        const airports = await prisma.airport.findMany();

        return new Response(JSON.stringify(airports), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ message: "Error" }), {
            status: 500,
        });
    }
};

//@desc     Create an airport
//@route    POST /api/v1/airports
//@access   Private
export const POST = async (req: NextApiRequest) => {
    const { AirportID, AirportName, City, Country } = req.body;

    if (!AirportID || !AirportName || !City || !Country) {
        return new Response(
            JSON.stringify({ message: `Something is missing` }),
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
        console.log(err);
        return new Response(JSON.stringify({ message: "Server Error" }), {
            status: 500,
        });
    }
};
