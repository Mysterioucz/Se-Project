import { getServerSession } from "next-auth";
import { Cart } from "../contexts/CheckoutContext";
import { nextAuthOptions } from "../lib/auth";

export type Flight = {
    FlightNo: string;
    DepartTime: Date;
    ArrivalTime: Date;
    ArrivalAirportID: string;
    DepartureAirportID: string;
    AirlineName: string;
    AircraftRegNo: string;
    AvailableSeat: number;
    TransitAmount: number;
    ExtraBaggage: boolean;
    SeatSelect: boolean;
    FreeCheckedBaggageWeight: number;
    FreeCheckedBaggageBags: number;
};

export async function fetchCartData(cartId: number): Promise<Cart> {
    const session = await getServerSession(nextAuthOptions);
    const userId = session?.user?.id;
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart/${userId}?CartID=${cartId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        },
    );
    if (!response.ok) {
        throw new Error("Failed to fetch cart data");
    }
    const res = await response.json();
    const data = res.data[0] as Cart;
    return data;
}

export async function fetchFlightData(
    flightNo: string,
    departureTime: Date,
    arrivalTime: Date,
): Promise<Flight> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/flights/lookup?flightNo=${flightNo}&departTime=${departureTime}&arrivalTime=${arrivalTime}`,
    );
    const res = await response.json();
    return res.data.flight as Flight;
}
