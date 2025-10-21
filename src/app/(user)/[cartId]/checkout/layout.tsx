import CheckoutProgress from "@/src/app/(user)/[cartId]/checkout/_components/CheckoutProgress";
import FooterButton from "@/src/app/(user)/[cartId]/checkout/_components/FooterButton";
import Navbar from "@/src/components/Navbar";
import PriceBreakdownCard, {
    BaggageSummaryProps,
    TicketSummaryProps,
} from "@/src/components/paymentConfirmation/priceBreakdownCard";
import { CheckoutProvider } from "@/src/contexts/CheckoutContext";
import { PassengerTypes } from "@/src/enums/PassengerTypes";
import { fetchCartData } from "@/src/helper/CheckoutHelper";
import BookingInfo from "./_components/BookingInfo";

export default async function CheckoutLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { cartId: string };
}) {
    const { cartId } = await params;
    const cartData = await fetchCartData(Number(cartId));

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

    // Baggage pricing is not stored on Cart in schema; default to free / zero values
    const baggage: BaggageSummaryProps = {
        personal_item_price: 0,
        carry_on_item_price: 0,
        checked_baggage_price: 0,
    };

    return (
        <div className="flex flex-col min-h-screen gap-8 pb-8 items-center">
            <Navbar />
            <CheckoutProgress />
            <CheckoutProvider cartData={cartData}>
                <div className="flex w-full px-32 gap-32">
                    <div className="flex w-full">{children}</div>
                    <div className="flex flex-col w-full gap-10 max-w-[21.25rem]">
                        <BookingInfo />
                        <PriceBreakdownCard
                            tickets={tickets}
                            baggage={baggage}
                        />
                    </div>
                </div>
                <FooterButton cartId={cartId} />
            </CheckoutProvider>
        </div>
    );
}
