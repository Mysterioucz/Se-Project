import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/airports:
 *   get:
 *     summary: Get all airports
 *     description: Retrieve a list of all airports
 *     tags:
 *       - Airports
 *     responses:
 *       200:
 *         description: Successfully retrieved airports
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
 *                       AirportID:
 *                         type: string
 *                       AirportName:
 *                         type: string
 *                       City:
 *                         type: string
 *                       Country:
 *                         type: string
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new airport
 *     description: Create a new airport (requires authentication)
 *     tags:
 *       - Airports
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - AirportID
 *               - AirportName
 *               - City
 *               - Country
 *             properties:
 *               AirportID:
 *                 type: string
 *                 example: BKK
 *               AirportName:
 *                 type: string
 *                 example: Suvarnabhumi Airport
 *               City:
 *                 type: string
 *                 example: Bangkok
 *               Country:
 *                 type: string
 *                 example: Thailand
 *     responses:
 *       200:
 *         description: Airport created successfully
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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
        return new Response(JSON.stringify({ message: ErrorMessages.SERVER }), {
            status: 500,
        });
    }
};

export const POST = async (req: NextRequest) => {
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.PERMISSION,
            }),
            { status: 401 }
        );
    }

    const { AirportID, AirportName, City, Country } = await req.json();

    if (!AirportID || !AirportName || !City || !Country) {
        return new Response(
            JSON.stringify({
                message: ErrorMessages.MISSING_PARAMETER,
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
        return new Response(JSON.stringify({ message: ErrorMessages.SERVER }), {
            status: 500,
        });
    }
};
