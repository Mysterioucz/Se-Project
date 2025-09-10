import prisma from "@/db";
import { authorize } from "@/src/lib/authMiddleware";
import { NextRequest } from "next/server";

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
export const POST = async (req: NextRequest) => {
    const protect = await authorize(req, ['Admin']);
    if (protect.status != 200) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authorized to this route'
            }),
            { status: 401 }
        );
    }

    const { AirportID, AirportName, City, Country } = await req.json();
    console.log('checkig airport attribute');
    if (!AirportID || !AirportName || !City || !Country) {
        return new Response(
            JSON.stringify({ message: `Something is missing` }),
            { status: 400 }
        );
    }
    console.log('pass missing check')
    try {
        const newAirport = await prisma.airport.create({
            data: {
                AirportID,
                AirportName,
                City,
                Country,
            },
        });
        console.log('passed create')
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
