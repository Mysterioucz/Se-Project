"use client";

import React, { createContext, useContext, useState } from "react";

type CheckoutContextType = {
    isPaymentValid: boolean;
    setIsPaymentValid: (v: boolean) => void;
    isContactValid: boolean;
    setIsContactValid: (v: boolean) => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(
    undefined,
);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
    const [isPaymentValid, setIsPaymentValid] = useState(false);
    const [isContactValid, setIsContactValid] = useState(true);

    return (
        <CheckoutContext.Provider
            value={{
                isPaymentValid,
                setIsPaymentValid,
                isContactValid,
                setIsContactValid,
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
