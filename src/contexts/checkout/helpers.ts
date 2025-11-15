import {
    Cart,
    CartMetadata,
    CheckoutPayload,
    PassengerData,
    BaggageAllowance,
    Seat,
} from "./types";
import { initialBaggageAllowance, initialPassengerData } from "./constants";

/**
 * Creates cart metadata from cart data
 */
export function createCartMetadata(cartData: Cart): CartMetadata {
    const totalPassengers =
        cartData.Adults + cartData.Childrens + cartData.Infants;

    return {
        cartId: cartData.id,
        flightType: cartData.FlightType,
        totalPassengers: totalPassengers,
        departFlightNo: cartData.Depart.FlightNo,
        returnFlightNo: cartData.Return?.FlightNo,
    };
}

/**
 * Ensures checkout data has valid cart metadata
 */
export function ensureCartMetadata(
    data: CheckoutPayload,
    cartData: Cart,
): CheckoutPayload {
    return {
        ...data,
        cartMetadata: createCartMetadata(cartData),
    };
}

/**
 * Creates an empty passenger with proper structure based on flight type
 */
export function createEmptyPassenger(cartData: Cart): PassengerData {
    const isRoundTrip = cartData.FlightType === "Round-trip";

    return {
        ...initialPassengerData,
        baggageAllowance: {
            departureBaggage: initialBaggageAllowance.departureBaggage,
            ...(isRoundTrip && {
                returnBaggage: {
                    ServiceID: "",
                    ServiceName: "",
                    Price: 0,
                    Description: "",
                },
            }),
        },
        seatSelection: {
            departureSeat: "",
            ...(isRoundTrip && { returnSeat: "" }),
        },
    };
}

/**
 * Ensures passenger list has the required length
 */
export function ensurePassengerListLength(
    passengers: PassengerData[],
    requiredLength: number,
    cartData: Cart,
): PassengerData[] {
    const list = [...passengers];
    while (list.length < requiredLength) {
        list.push(createEmptyPassenger(cartData));
    }
    return list;
}

/**
 * Updates a passenger at a specific index
 */
export function updatePassengerAtIndex(
    passengers: PassengerData[],
    index: number,
    patch: Partial<PassengerData>,
    cartData: Cart,
): PassengerData[] {
    const list = ensurePassengerListLength(passengers, index + 1, cartData);
    list[index] = { ...list[index], ...patch };
    return list;
}

/**
 * Updates seat selection for a passenger at a specific index
 */
export function updatePassengerSeatAtIndex(
    passengers: PassengerData[],
    index: number,
    seatPatch: Partial<Seat>,
    cartData: Cart,
): PassengerData[] {
    const list = ensurePassengerListLength(passengers, index + 1, cartData);
    list[index] = {
        ...list[index],
        seatSelection: {
            ...list[index].seatSelection,
            ...seatPatch,
        },
    };
    return list;
}

/**
 * Updates baggage allowance for a passenger at a specific index
 */
export function updatePassengerBaggageAtIndex(
    passengers: PassengerData[],
    index: number,
    baggagePatch: Partial<BaggageAllowance>,
    cartData: Cart,
): PassengerData[] {
    const list = ensurePassengerListLength(passengers, index + 1, cartData);
    list[index] = {
        ...list[index],
        baggageAllowance: {
            ...list[index].baggageAllowance,
            ...baggagePatch,
        },
    };
    return list;
}

/**
 * Validates if an index is within valid range
 */
export function isValidPassengerIndex(
    index: number,
    passengers: PassengerData[],
): boolean {
    return index >= 0 && index < passengers.length;
}
