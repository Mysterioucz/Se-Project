import CheckoutProgress from "@/src/app/(user)/[cartId]/checkout/_components/CheckoutProgress";
import FooterButton from "@/src/app/(user)/[cartId]/checkout/_components/FooterButton";
import Navbar from "@/src/components/Navbar";
import PriceBreakdownCard, {
    BaggageSummaryProps,
    TicketSummaryProps,
} from "@/src/components/paymentConfirmation/priceBreakdownCard";
import { CheckoutProvider } from "@/src/contexts/CheckoutContext";
import { PassengerTypes } from "@/src/enums/PassengerTypes";
import { Cart } from "@/src/generated/prisma/wasm";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { BookingInfoProps, Flight } from "./_components/BookingInfo";
import BookingInfo from "./_components/BookingInfo";

async function fetchCartData(cartId: number): Promise<Cart> {
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
    return response.json();
}

async function fetchFlightLookup(flightNo: string, departTime: string, arrivalTime: string) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/flights/lookup?flightNo=${flightNo}&departTime=${encodeURIComponent(
            departTime
        )}&arrivalTime=${encodeURIComponent(arrivalTime)}`,
        { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch flight info");
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Flight lookup failed");
    return data.data.flight;
}

export async function fetchBookingInfo(cartId: number): Promise<BookingInfoProps> {
    const cartData: Cart = await fetchCartData(cartId);

    // --- Departure flight ---
    const departStart = cartData.DepartFlightDepartTime ? new Date(cartData.DepartFlightDepartTime) : null;
    const departEnd = cartData.DepartFlightArrivalTime ? new Date(cartData.DepartFlightArrivalTime) : null;

    let departureCity = "Departure City Placeholder";
    let arrivalCity = "Arrival City Placeholder";

    if (cartData.DepartFlightNo && departStart && departEnd) {
        try {
            const flightInfo = await fetchFlightLookup(
                cartData.DepartFlightNo,
                departStart.toISOString(),
                departEnd.toISOString()
            );
            departureCity = flightInfo.departureAirport || departureCity;
            arrivalCity = flightInfo.arrivalAirport || arrivalCity;
        } catch (err) {
            console.warn("Failed to fetch departure flight info:", err);
        }
    }

    const departure: Flight = {
        flightNumber: cartData.DepartFlightNo,
        departureCity,
        departureTime: departStart ? departStart.toLocaleTimeString() : "",
        arrivalCity,
        arrivalTime: departEnd ? departEnd.toLocaleTimeString() : "",
        date: departStart ? departStart.toISOString().split("T")[0] : "",
        duration: departStart && departEnd ? calculateDuration(departStart, departEnd) : "",
    };

    // --- Return flight ---
    let arrival: Flight | null = null;
    if (cartData.ReturnFlightNo && cartData.ReturnFlightDepartTime && cartData.ReturnFlightArrivalTime) {
        const returnStart = new Date(cartData.ReturnFlightDepartTime);
        const returnEnd = new Date(cartData.ReturnFlightArrivalTime);

        let returnDepartureCity = "Arrival City Placeholder";
        let returnArrivalCity = "Departure City Placeholder";

        try {
            const flightInfo = await fetchFlightLookup(
                cartData.ReturnFlightNo,
                returnStart.toISOString(),
                returnEnd.toISOString()
            );
            returnDepartureCity = flightInfo.departureAirport || returnDepartureCity;
            returnArrivalCity = flightInfo.arrivalAirport || returnArrivalCity;
        } catch (err) {
            console.warn("Failed to fetch return flight info:", err);
        }

        arrival = {
            flightNumber: cartData.ReturnFlightNo,
            departureCity: returnDepartureCity,
            departureTime: returnStart.toLocaleTimeString(),
            arrivalCity: returnArrivalCity,
            arrivalTime: returnEnd.toLocaleTimeString(),
            date: returnStart.toISOString().split("T")[0],
            duration: calculateDuration(returnStart, returnEnd),
        };
    }

    return { departure, arrival };
}

// Helper function
function calculateDuration(start: Date, end: Date): string {
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}

export default async function CheckoutLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { cartId: string };
}) {
    const dummyTickets: TicketSummaryProps[] = [
        { type: PassengerTypes.Adult, price: 1000, quantity: 1 },
        { type: PassengerTypes.Child, price: 500, quantity: 2 },
    ];
    const dummyBaggage: BaggageSummaryProps = {
        personal_item_price: 0,
        carry_on_item_price: 1000,
        checked_baggage_price: 2000,
    };
    const { cartId } = await params;
    const cartData = await fetchCartData(Number(cartId));
    const cartBookingInfo = await fetchBookingInfo(Number(cartId));

    return (
        <div className="flex flex-col min-h-screen gap-8 pb-8 items-center">
            <Navbar />
            <CheckoutProgress />
            <CheckoutProvider cartData={cartData}>
                <div className="flex w-full px-32 gap-32">
                    <div className="flex w-full">{children}</div>
                    <div className="flex flex-col w-full gap-10 max-w-[21.25rem]">
                        <BookingInfo departure={cartBookingInfo.departure} arrival={cartBookingInfo.arrival}/>
                        <PriceBreakdownCard
                            tickets={dummyTickets}
                            baggage={dummyBaggage}
                        />
                    </div>
                </div>
                <FooterButton />
            </CheckoutProvider>
        </div>
    );
}
