import { Cart, CartMetadata, CheckoutPayload } from "./types";

/**
 * Validates if stored checkout data matches the current cart
 */
export function validateCheckoutDataAgainstCart(
    checkoutData: CheckoutPayload,
    cartData: Cart,
): boolean {
    if (!checkoutData.cartMetadata) return false;

    const totalPassengers =
        cartData.Adults + cartData.Childrens + cartData.Infants;
    const metadata = checkoutData.cartMetadata;

    // Check cart ID match
    if (metadata.cartId !== cartData.id) return false;

    // Check flight type match
    if (metadata.flightType !== cartData.FlightType) return false;

    // Check passenger count match
    if (metadata.totalPassengers !== totalPassengers) return false;

    // Check departure flight match
    if (metadata.departFlightNo !== cartData.Depart.FlightNo) return false;

    // Check return flight match for round-trip
    if (cartData.FlightType === "Round-trip") {
        if (
            !cartData.Return ||
            metadata.returnFlightNo !== cartData.Return.FlightNo
        ) {
            return false;
        }
    }

    return true;
}

/**
 * Validates stored data on load from localStorage
 */
export function validateStoredData(
    parsed: any,
    cartData: Cart,
): { isValid: boolean; reason?: string } {
    if (!parsed.cartMetadata) {
        return { isValid: false, reason: "No cart metadata" };
    }

    const totalPassengers =
        cartData.Adults + cartData.Childrens + cartData.Infants;
    const metadata = parsed.cartMetadata as CartMetadata;

    if (metadata.cartId !== cartData.id) {
        return { isValid: false, reason: "Cart ID mismatch" };
    }

    if (metadata.flightType !== cartData.FlightType) {
        return { isValid: false, reason: "Flight type mismatch" };
    }

    if (metadata.totalPassengers !== totalPassengers) {
        return { isValid: false, reason: "Passenger count mismatch" };
    }

    if (metadata.departFlightNo !== cartData.Depart.FlightNo) {
        return { isValid: false, reason: "Departure flight mismatch" };
    }

    if (cartData.FlightType === "Round-trip") {
        if (
            !cartData.Return ||
            metadata.returnFlightNo !== cartData.Return.FlightNo
        ) {
            return { isValid: false, reason: "Return flight mismatch" };
        }
    }

    return { isValid: true };
}

/**
 * Checks if all passengers have selected seats
 */
export function areAllSeatsSelected(
    passengerData: any[],
    flightType: string,
): boolean {
    const isRoundTrip = flightType === "Round-trip";

    return passengerData.every((passenger) => {
        const hasDepartureSeat = !!passenger.seatSelection?.departureSeat;

        if (isRoundTrip) {
            const hasReturnSeat = !!passenger.seatSelection?.returnSeat;
            return hasDepartureSeat && hasReturnSeat;
        }

        return hasDepartureSeat;
    });
}
