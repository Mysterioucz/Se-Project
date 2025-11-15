"use client";

import React, { createContext, useContext } from "react";
import { Flight } from "../helper/CheckoutHelper";
import {
    CHECKOUT_STORAGE_KEY,
    initialBaggageAllowance,
    initialCheckoutData,
    initialPassengerData,
    initialSeatSelection,
} from "./checkout/constants";
import {
    ensureCartMetadata,
    updatePassengerAtIndex,
    updatePassengerBaggageAtIndex,
    updatePassengerSeatAtIndex,
} from "./checkout/helpers";
import { useCheckoutInitialization } from "./checkout/hooks";
import {
    clearCheckoutStorage,
    saveCheckoutToStorage,
} from "./checkout/storage";
import {
    BaggageAllowance,
    Cart,
    CheckoutContextType,
    CheckoutPayload,
    PassengerData,
    Seat,
} from "./checkout/types";
import {
    areAllSeatsSelected as checkAllSeatsSelected,
    validateCheckoutDataAgainstCart,
} from "./checkout/validation";

// Re-export types and constants for backward compatibility
export type {
    BaggageAllowance,
    Cart,
    CheckoutPayload,
    Info,
    PassengerData,
    Payment,
    Seat,
    ServiceType,
} from "./checkout/types";

export {
    CHECKOUT_STORAGE_KEY,
    initialBaggageAllowance,
    initialPassengerData,
    initialSeatSelection,
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
    undefined,
);

export function CheckoutProvider({
    children,
    cartData,
    departFlight,
    returnFlight,
}: {
    children: React.ReactNode;
    cartData: Cart;
    departFlight: Flight;
    returnFlight?: Flight;
}) {
    const { checkoutData, setCheckoutData } =
        useCheckoutInitialization(cartData);

    // Validate if stored checkout data matches current cart
    const isCheckoutDataValid = (): boolean => {
        return validateCheckoutDataAgainstCart(checkoutData, cartData);
    };

    // Update checkout data with cart metadata
    const updateCheckoutData = (data: Partial<CheckoutPayload>) => {
        setCheckoutData((prev) => {
            const updatedData = ensureCartMetadata(
                { ...prev, ...data },
                cartData,
            );
            saveCheckoutToStorage(updatedData);
            return updatedData;
        });
    };

    // Clear checkout data
    const clearCheckoutData = () => {
        clearCheckoutStorage();
        setCheckoutData(initialCheckoutData);
    };

    // Update passenger at specific index
    const updatePassengerAt = (
        index: number,
        passengerPatch: Partial<PassengerData>,
    ) => {
        if (index < 0) {
            console.warn("updatePassengerAt: index out of range", index);
            return;
        }

        setCheckoutData((prev) => {
            const updatedPassengers = updatePassengerAtIndex(
                prev.passengerData,
                index,
                passengerPatch,
                cartData,
            );
            const updated = ensureCartMetadata(
                { ...prev, passengerData: updatedPassengers },
                cartData,
            );
            saveCheckoutToStorage(updated);
            return updated;
        });
    };

    // Update passenger seat at specific index
    const updatePassengerSeatAt = (index: number, seatPatch: Partial<Seat>) => {
        if (index < 0) {
            console.warn("updatePassengerSeatAt: index out of range", index);
            return;
        }

        setCheckoutData((prev) => {
            const updatedPassengers = updatePassengerSeatAtIndex(
                prev.passengerData,
                index,
                seatPatch,
                cartData,
            );
            const updated = ensureCartMetadata(
                { ...prev, passengerData: updatedPassengers },
                cartData,
            );
            saveCheckoutToStorage(updated);
            return updated;
        });
    };

    // Update baggage at specific index
    const updateBaggageAt = (
        index: number,
        baggagePatch: Partial<BaggageAllowance>,
    ) => {
        if (index < 0) {
            console.warn("updateBaggageAt: index out of range", index);
            return;
        }

        setCheckoutData((prev) => {
            const updatedPassengers = updatePassengerBaggageAtIndex(
                prev.passengerData,
                index,
                baggagePatch,
                cartData,
            );
            const updated = ensureCartMetadata(
                { ...prev, passengerData: updatedPassengers },
                cartData,
            );
            saveCheckoutToStorage(updated);
            return updated;
        });
    };

    // Check if all seats are selected
    const areAllSeatsSelected = (): boolean => {
        return checkAllSeatsSelected(
            checkoutData.passengerData,
            cartData.FlightType,
        );
    };

    return (
        <CheckoutContext.Provider
            value={{
                checkoutData,
                updateCheckoutData,
                clearCheckoutData,
                updatePassengerAt,
                updatePassengerSeatAt,
                updateBaggageAt,
                areAllSeatsSelected,
                isCheckoutDataValid,
                cartData,
                departFlight,
                returnFlight,
            }}
        >
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckout() {
    const ctx = useContext(CheckoutContext);
    if (!ctx) {
        throw new Error("useCheckout must be used within a CheckoutProvider");
    }
    return ctx;
}

export default CheckoutContext;
