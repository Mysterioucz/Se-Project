"use client";

import { getSession } from "next-auth/react";
import React, { createContext, useContext, useState } from "react";
import { Cart } from "../generated/prisma";

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
    dayOfBirth: string;
    monthOfBirth: string;
    yearOfBirth: string;
    nationality: string;
    passportNo: string;
    dayOfIssue: string;
    monthOfIssue: string;
    yearOfIssue: string;
    dayOfExpiry: string;
    monthOfExpiry: string;
    yearOfExpiry: string;
    baggageAllowance: BaggageAllowance; // in kg
    seatSelection: Seat; // Seat No
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
    clearCheckoutData: () => void; // after successful payment
    cartData: Promise<Cart>;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
    undefined,
);

const CHECKOUT_STORAGE_KEY = "tempCheckout";

const initialPassengerData: PassengerData = {
    givenName: "",
    lastName: "",
    gender: "",
    dayOfBirth: "",
    monthOfBirth: "",
    yearOfBirth: "",
    nationality: "",
    passportNo: "",
    dayOfIssue: "",
    monthOfIssue: "",
    yearOfIssue: "",
    dayOfExpiry: "",
    monthOfExpiry: "",
    yearOfExpiry: "",
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

async function fetchCartData() {
    const session = await getSession();
    const userId = session?.user?.id;
    const response = await fetch(`/api/v1/cart/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch cart data");
    }
    return response.json();
}

function getInitialCheckoutData(): CheckoutPayload {
    if (typeof window !== "undefined") {
        const storedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
        if (storedData) {
            try {
                return JSON.parse(storedData) as CheckoutPayload;
            } catch (error) {
                console.error(
                    "Failed to parse checkout data from localStorage:",
                    error,
                );
            }
        }
    }
    return initialCheckoutData;
}

export function CheckoutProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [checkoutData, setCheckoutData] = useState<CheckoutPayload>(
        getInitialCheckoutData(),
    );
    const cartData = fetchCartData();

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

    return (
        <CheckoutContext.Provider
            value={{
                checkoutData,
                updateCheckoutData,
                clearCheckoutData,
                updatePassengerAt,
                cartData
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
