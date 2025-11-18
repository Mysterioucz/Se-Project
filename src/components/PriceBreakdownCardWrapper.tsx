"use client";

import { useCheckout } from "@/src/contexts/CheckoutContext";
import PriceBreakdownCard, {
    FlightPricing,
    TicketSummaryProps,
} from "./priceBreakdownCard";

interface PriceBreakdownCardWrapperProps {
    tickets: TicketSummaryProps[];
    servicesFee?: number;
    flightPricing?: FlightPricing;
    isRoundTrip?: boolean;
}

export default function PriceBreakdownCardWrapper({
    tickets,
    servicesFee,
    flightPricing,
    isRoundTrip = false,
}: PriceBreakdownCardWrapperProps) {
    const { checkoutData } = useCheckout();

    return (
        <PriceBreakdownCard
            tickets={tickets}
            servicesFee={servicesFee}
            flightPricing={flightPricing}
            isRoundTrip={isRoundTrip}
            passengerData={checkoutData.passengerData}
        />
    );
}
