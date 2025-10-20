"use client";

import React, { createContext, useContext, useState } from "react";

interface Payment {
    isPaymentValid: boolean;
    isContactValid: boolean;
    isQRmethod: boolean;
    isQRModalOpen: boolean;
}

interface Seat {
    departureSeat: string; // Seat No
    returnSeat?: string;
}

export interface BaggageAllowance {
    departureBaggage: number; // in kg
    returnBaggage?: number;
}

export interface PassengerData {
    givenName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    nationality: string;
    passportNo: string;
    issueDate: string;
    expiryDate: string;
    baggageAllowance: BaggageAllowance; // in kg
    seatSelection: Seat; // Seat No
}

export interface Cart {
    id: number;
    FlightType: string;
    ClassType: string;
    Adults: number;
    Childrens: number;
    Infants: number;
    Price: number;
    DepartureAirport: string;
    ArrivalAirport: string;
    DepartureCity: string;
    ArrivalCity: string;
    Depart: {
        FlightNo: string;
        DepartTime: Date;
        ArrivalTime: Date;
        AirlineName: string;
        Stops: number;
    };
    Return: {
        FlightNo: string;
        DepartTime: Date;
        ArrivalTime: Date;
        AirlineName: string;
        Stops: number;
    };
}

interface CheckoutPayload {
    passengerData: PassengerData[];
    payment: Payment;
}

type CheckoutContextType = {
    checkoutData: CheckoutPayload;
    updateCheckoutData: (data: Partial<CheckoutPayload>) => void;
    updatePassengerAt: (
        index: number,
        passengerPatch: Partial<PassengerData>,
    ) => void;
    updatePassengerSeatAt: (index: number, seatPatch: Partial<Seat>) => void;
    clearCheckoutData: () => void; // after successful payment
    cartData: Cart;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
    undefined,
);

export const CHECKOUT_STORAGE_KEY = "tempCheckout";

const initialPassengerData: PassengerData = {
    givenName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    passportNo: "",
    issueDate: "",
    expiryDate: "",
    baggageAllowance: {
        departureBaggage: 0,
        returnBaggage: 0,
    },
    seatSelection: {
        departureSeat: "",
        returnSeat: "",
    },
};

const initialCheckoutData: CheckoutPayload = {
    passengerData: [initialPassengerData],
    payment: {
        isPaymentValid: false,
        isContactValid: false,
        isQRmethod: false,
        isQRModalOpen: false,
    },
};

export function CheckoutProvider({
    children,
    cartData,
}: {
    children: React.ReactNode;
    cartData: Cart;
}) {
    const [checkoutData, setCheckoutData] =
        useState<CheckoutPayload>(initialCheckoutData);

    const updateCheckoutData = (data: Partial<CheckoutPayload>) => {
        setCheckoutData((prev) => {
            const updatedData = { ...prev, ...data };
            if (typeof window !== "undefined") {
                localStorage.setItem(
                    CHECKOUT_STORAGE_KEY,
                    JSON.stringify(updatedData),
                );
            }
            return updatedData;
        });
    };
    const clearCheckoutData = () => {
        sessionStorage.removeItem(CHECKOUT_STORAGE_KEY);
        setCheckoutData(initialCheckoutData);
    };

    // helper to make an empty PassengerData (you already have `initialPassengerData`)
    const makeEmptyPassenger = (): PassengerData => ({
        ...initialPassengerData, // or create a fresh object if needed
    });

    // ensures list has length > index
    const ensurePassengerAt = (index: number) => {
        setCheckoutData((prev) => {
            const list = [...(prev.passengerData ?? [])];
            while (list.length <= index) {
                list.push(makeEmptyPassenger());
            }
            const updated = { ...prev, passengerData: list };
            if (typeof window !== "undefined")
                localStorage.setItem(
                    CHECKOUT_STORAGE_KEY,
                    JSON.stringify(updated),
                );
            return updated;
        });
    };
    const updatePassengerAt = (
        index: number,
        passengerPatch: Partial<PassengerData>,
    ) => {
        setCheckoutData((prev) => {
            const list = [...(prev.passengerData ?? [])];
            if (index < 0) {
                console.warn("updatePassengerAt: index out of range", index);
                return prev;
            } else if (index >= list.length) {
                ensurePassengerAt(index);
            }
            list[index] = { ...list[index], ...passengerPatch };
            const updated = { ...prev, passengerData: list };
            if (typeof window !== "undefined")
                localStorage.setItem(
                    CHECKOUT_STORAGE_KEY,
                    JSON.stringify(updated),
                );
            return updated;
        });
    };

    const updatePassengerSeatAt = (index: number, seatPatch: Partial<Seat>) => {
        setCheckoutData((prev) => {
            const list = [...(prev.passengerData ?? [])];
            if (index < 0) {
                console.warn(
                    "updatePassengerSeatAt: index out of range",
                    index,
                );
                return prev;
            } else if (index >= list.length) {
                ensurePassengerAt(index);
            }
            list[index].seatSelection = {
                ...list[index].seatSelection,
                ...seatPatch,
            };
            const updated = { ...prev, passengerData: list };
            if (typeof window !== "undefined")
                localStorage.setItem(
                    CHECKOUT_STORAGE_KEY,
                    JSON.stringify(updated),
                );
            return updated;
        });
    };

    return (
        <CheckoutContext.Provider
            value={{
                checkoutData,
                updateCheckoutData,
                clearCheckoutData,
                updatePassengerAt,
                updatePassengerSeatAt,
                cartData,
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
