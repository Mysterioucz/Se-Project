import { useEffect, useRef, useState } from "react";
import { initialCheckoutData } from "./constants";
import {
    clearCheckoutStorage,
    loadCheckoutFromStorage,
    saveCheckoutToStorage,
} from "./storage";
import { Cart, CheckoutPayload } from "./types";

/**
 * Hook to initialize checkout data from localStorage
 * Only validates cart ID to preserve data across page refreshes
 * More lenient than before to prevent data loss
 */
export function useCheckoutInitialization(cartData: Cart) {
    const [checkoutData, setCheckoutData] =
        useState<CheckoutPayload>(initialCheckoutData);
    const isInitializedRef = useRef(false);
    const cartIdRef = useRef<number>(cartData.id);

    useEffect(() => {
        // Only initialize once per cart ID to preserve data across refreshes
        if (
            typeof window !== "undefined" &&
            (!isInitializedRef.current || cartIdRef.current !== cartData.id)
        ) {
            console.log(
                "[CheckoutInit] Initializing checkout data from storage...",
            );
            const stored = loadCheckoutFromStorage();

            if (stored) {
                console.log("[CheckoutInit] Found stored checkout data:", {
                    storedCartId: stored.cartMetadata?.cartId,
                    currentCartId: cartData.id,
                    storedFlightType: stored.cartMetadata?.flightType,
                    currentFlightType: cartData.FlightType,
                    stored: stored,
                });

                // Only validate cart ID - this allows data to persist across page refreshes
                // even if flight details or passenger counts change slightly
                if (
                    !stored.cartMetadata ||
                    stored.cartMetadata.cartId !== cartData.id
                ) {
                    console.log(
                        `[CheckoutInit] Cart ID mismatch or no metadata: stored=${stored.cartMetadata?.cartId}, current=${cartData.id}`,
                    );
                    console.log(
                        "[CheckoutInit] Clearing stored data due to different cart",
                    );
                    clearCheckoutStorage();
                } else {
                    console.log(
                        "[CheckoutInit] Cart ID matches, loading stored data (preserving across refresh)",
                    );
                    setCheckoutData(stored);
                }
            } else {
                console.log("[CheckoutInit] No stored checkout data found");
            }

            isInitializedRef.current = true;
            cartIdRef.current = cartData.id;
        }
    }, [cartData.id]);

    return {
        checkoutData,
        setCheckoutData,
        isInitialized: isInitializedRef.current,
    };
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
