import CheckoutProgress from "@/src/app/(user)/checkout/_components/CheckoutProgress";
import FooterButton from "@/src/app/(user)/checkout/_components/FooterButton";
import Navbar from "@/src/components/Navbar";
import PriceBreakdownCard, {
    BaggageSummaryProps,
    TicketSummaryProps,
} from "@/src/components/paymentConfirmation/priceBreakdownCard";
import { CheckoutProvider } from "@/src/contexts/CheckoutContext";
import { PassengerTypes } from "@/src/enums/PassengerTypes";
import BookingInfo from "./_components/BookingInfo";

export default async function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
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
    return (
        <div className="flex flex-col min-h-screen gap-8 pb-8 items-center">
            <Navbar />
            <CheckoutProgress />
            <CheckoutProvider>
                <div className="flex w-full px-32 gap-32">
                    <div className="flex w-full">{children}</div>
                    <div className="flex flex-col w-full gap-10 max-w-[21.25rem]">
                        <BookingInfo />
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
