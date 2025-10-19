import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { NextRequest } from "next/server";

//@desc     Get additional services and seat availability for a specific flight
//@route    GET /api/v1/flights/lookup?flightNo=...&departTime=...&arrivalTime=...
//@access   Public
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const flightNo = searchParams.get('flightNo');
    const departTime = searchParams.get('departTime'); // format : 2025-09-27T01:25:20.000Z
    const arrivalTime = searchParams.get('arrivalTime');
     
    if (!flightNo || !departTime || !arrivalTime) {
      return new Response(
            JSON.stringify({
                success: false,
                error: ErrorMessages.MISSING_PARAMETER,
            }),
            { status: 400 }
        );
    }

    const flight = await prisma.flight.findUnique({
      where: {
        FlightNo_DepartTime_ArrivalTime: {
          FlightNo: flightNo,
          DepartTime: departTime,
          ArrivalTime: arrivalTime,
        },
      },
      select: {
        availableServices: {
          select: {
            service: {
              select: {
                ServiceName: true,
                Price: true,
                Description: true,
              }
            }
          }
        },
        seats: {
          // It should retrieve both available and unavailable
          // where: {
          //   IsAvailable: true
          // },
          select: {
            SeatNo: true,
            SeatType: true,
            IsAvailable: true
          }
        }
      },
    });

    if (!flight) {
      return new Response(
        JSON.stringify({
            success: false,
            error: ErrorMessages.NOT_FOUND,
        }),
        { status: 404 }
      );
    }

    const services = flight.availableServices.map(s => s.service.ServiceName);

    const responseData = {
      services,
      ...(services.includes("Select Seat") && {availableSeats : flight.seats || []})
    };

    return new Response(
      JSON.stringify({
          success: true,
          data: responseData,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
          success: false,
          message: ErrorMessages.SERVER,
      }),
      { status: 500 }
    );
  }
}