import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db"; // Ensure prisma is correctly set up
import { ErrorMessages } from "@/src/enums/ErrorMessages";

export async function GET() {
    try {
        // Fetch cities from the database, ensuring they are distinct
        const airlines = await prisma.airline.findMany({
            distinct: ["AirlineName"], // Fetch only distinct cities
            select: {
                AirlineName: true, // Only select the City field
            },
        });
        if (airlines.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: ErrorMessages.NOT_FOUND,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: airlines,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: ErrorMessages.SERVER,
            },
            { status: 500 }
        );
    }
}
