import prisma from "@/db"; // Ensure prisma is correctly set up
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/cities:
 *   get:
 *     summary: Get all cities
 *     description: Retrieve a list of all distinct cities from airports
 *     tags:
 *       - Cities
 *     responses:
 *       200:
 *         description: Successfully retrieved cities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       City:
 *                         type: string
 *                         example: Bangkok
 *       404:
 *         description: No cities found
 *       500:
 *         description: Server error
 */
export async function GET() {
    try {
        // Fetch cities from the database, ensuring they are distinct
        const cities = await prisma.airport.findMany({
            distinct: ["City"], // Fetch only distinct cities
            select: {
                City: true, // Only select the City field
            },
        });
        if (cities.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: ErrorMessages.NOT_FOUND,
                },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: cities,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                message: ErrorMessages.SERVER,
            },
            { status: 500 },
        );
    }
}
