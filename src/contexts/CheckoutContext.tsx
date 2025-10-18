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

interface BaggageAllowance {
    departureBaggage: number; // in kg
    returnBaggage?: number;
}

interface PassengerData {
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
    clearCheckoutData: () => void; // after successful payment
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
    undefined,
);

const CHECKOUT_STORAGE_KEY = "tempCheckout";

const initialCheckoutData: CheckoutPayload = {
    passengerData: [],
    payment: {
        isPaymentValid: false,
        isContactValid: false,
        isQRmethod: false,
        isQRModalOpen: false,
    },
};

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

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
    const [checkoutData, setCheckoutData] = useState<CheckoutPayload>(
        getInitialCheckoutData(),
    );
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

    return (
        <CheckoutContext.Provider
            value={{ checkoutData, updateCheckoutData, clearCheckoutData }}
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
