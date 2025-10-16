// import prisma from "@/db";
// import { ErrorMessages } from "@/src/enums/ErrorMessages";
// import { NextRequest } from "next/server";

// interface IParams {
//   params: {
//     id: string;
//   };
// }

// //@desc     Get additional services and seat avaliability for ticket's flight
// //@route    GET /api/v1/ticket/{id}
// //@access   Public
// export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) 
// {
//   try {
//     const { id } = await context.params;
//     const ticket = await prisma.ticket.findUnique({
//       where: {
//         TicketID: id,
//       },
//       select: {
//         flight: {
//           select: {
//             ExtraBaggage: true,
//             SeatSelect: true,
//             aircraft: {
//               select: {
//                 AircraftRegNo: true, 
//                 seats: {
//                   orderBy: {
//                     SeatNo: 'asc', 
//                   },
//                   select: {
//                     SeatNo: true,
//                     SeatType: true,
//                     IsAvailable: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     });
//     if (!ticket || !ticket.flight) {
//       return new Response(
//             JSON.stringify({
//                 success: false,
//                 error: `Ticket with ID '${id}' not found or has no associated flight.`,
//             }),
//             { status: 404 } 
//         );
//     }

//     const responseData = {
//       services: {
//         extraBaggageAvailable: ticket.flight.ExtraBaggage,
//         seatSelectionAvailable: ticket.flight.SeatSelect,
//       },
//       ...(ticket.flight.SeatSelect && { seats: ticket.flight.aircraft?.seats || [] }),
//     };

//     return new Response(
//       JSON.stringify({
//         success: true,
//         data: responseData,
//       }),
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching ticket:", error); 
//     return new Response(
//             JSON.stringify({
//                 message: ErrorMessages.SERVER,
//             }),
//             { status: 500 }
//         );
//   }

// }

