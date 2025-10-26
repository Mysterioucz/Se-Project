import prisma from "@/db"; // Ensure prisma is correctly set up
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/v1/airlines:
 *   get:
 *     summary: Get all airlines
 *     description: Retrieve a list of all distinct airline names
 *     tags:
 *       - Airlines
 *     responses:
 *       200:
 *         description: Successfully retrieved airlines
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
 *                       AirlineName:
 *                         type: string
 *                         example: Thai Airways
 *       404:
 *         description: No airlines found
 *       500:
 *         description: Server error
 */
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
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                data: airlines,
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
