import prisma from "@/db";

export async function GET() {
    // GET all flights
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
