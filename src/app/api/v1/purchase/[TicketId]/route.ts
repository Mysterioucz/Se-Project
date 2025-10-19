import { NextRequest } from "next/server";

export async function POST(req: NextRequest, { params }: { params: Promise<{ TicketId: string }> }) {
    const { TicketId } = await params;
    
    


    return new Response(JSON.stringify({ message: `Purchase processed for Ticket ID: ${TicketId}` }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}