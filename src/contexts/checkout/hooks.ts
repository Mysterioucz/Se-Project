import { useEffect, useState } from "react";
import { Cart, CheckoutPayload } from "./types";
import { initialCheckoutData } from "./constants";
import {
    loadCheckoutFromStorage,
    saveCheckoutToStorage,
    clearCheckoutStorage,
} from "./storage";
import { validateStoredData } from "./validation";

/**
 * Hook to initialize checkout data from localStorage
 * Validates stored data against current cart and clears if mismatch
 */
export function useCheckoutInitialization(cartData: Cart) {
    const [checkoutData, setCheckoutData] =
        useState<CheckoutPayload>(initialCheckoutData);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined" && !isInitialized) {
            const stored = loadCheckoutFromStorage();

            if (stored) {
                const validation = validateStoredData(stored, cartData);

                if (validation.isValid) {
                    setCheckoutData(stored);
                } else {
                    console.log(
                        `Stored checkout data doesn't match current cart: ${validation.reason}`,
                    );
                    clearCheckoutStorage();
                }
            }

            setIsInitialized(true);
        }
    }, [cartData, isInitialized]);

    return { checkoutData, setCheckoutData, isInitialized };
}

/**
 * Hook to persist checkout data to localStorage
 */
export function useCheckoutPersistence(
    checkoutData: CheckoutPayload,
    enabled: boolean = true,
) {
    useEffect(() => {
        if (enabled && typeof window !== "undefined") {
            saveCheckoutToStorage(checkoutData);
        }
    }, [checkoutData, enabled]);
}
