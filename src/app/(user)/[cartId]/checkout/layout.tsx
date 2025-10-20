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
