import CheckoutProgress from "@/src/app/(user)/[cartId]/checkout/_components/CheckoutProgress";
import FooterButton from "@/src/app/(user)/[cartId]/checkout/_components/FooterButton";
import Navbar from "@/src/components/Navbar";
import { CheckoutProvider } from "@/src/contexts/CheckoutContext";
import { PassengerTypes } from "@/src/enums/PassengerTypes";
import { fetchCartData, fetchFlightData } from "@/src/helper/CheckoutHelper";
import PriceBreakdownCard, {
    TicketSummaryProps,
} from "@components/priceBreakdownCard";
import BookingInfo from "./_components/BookingInfo";

export default async function CheckoutLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ cartId: string }>;
}) {
    const { cartId } = await params;
    const cartData = await fetchCartData(Number(cartId));
    const departData = await fetchFlightData(
        cartData.Depart.FlightNo,
        cartData.Depart.DepartTime,
        cartData.Depart.ArrivalTime,
    );
    let returnData = undefined;
    if (cartData.Return) {
        returnData = await fetchFlightData(
            cartData.Return.FlightNo,
            cartData.Return.DepartTime,
            cartData.Return.ArrivalTime,
        );
    }

    // Map cartData to ticket & baggage props expected by PriceBreakdownCard
    const adultCount = cartData?.Adults ?? 0;
    const childCount = cartData?.Childrens ?? 0;
    const infantCount = cartData?.Infants ?? 0;

    // The `Price` on Cart appears to be the total price stored in cart.
    // We'll distribute it proportionally across passenger types by count.
    const totalPassengers = adultCount + childCount + infantCount || 1;
    const pricePerPassenger = (cartData?.Price ?? 0) / totalPassengers;

    const tickets: TicketSummaryProps[] = [
        {
            type: PassengerTypes.Adult,
            price: pricePerPassenger,
            quantity: adultCount,
        },
        {
            type: PassengerTypes.Child,
            price: pricePerPassenger,
            quantity: childCount,
        },
        // Represent infants using Adult label as a fallback; adjust later if UI supports infants separately
        {
            type: PassengerTypes.Adult,
            price: pricePerPassenger,
            quantity: infantCount,
        },
    ].filter((t) => t.quantity > 0);

    return (
        <div className="flex min-h-screen flex-col items-center gap-8 pb-8">
            <Navbar />
            <CheckoutProgress />
            <CheckoutProvider
                cartData={cartData}
                departFlight={departData}
                returnFlight={returnData}
            >
                <div className="flex w-full gap-32 px-32">
                    <div className="flex w-full">{children}</div>
                    <div className="flex w-full max-w-[21.25rem] flex-col gap-10">
                        <BookingInfo />
                        <PriceBreakdownCard tickets={tickets} />
                    </div>
                </div>
                <FooterButton cartId={cartId} />
            </CheckoutProvider>
        </div>
    );
}
