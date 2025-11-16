import { CHECKOUT_STORAGE_KEY } from "./constants";
import { CheckoutPayload } from "./types";

/**
 * Loads checkout data from localStorage
 */
export function loadCheckoutFromStorage(): CheckoutPayload | null {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!stored) {
        console.log("[Storage] No data found in localStorage");
        return null;
    }

    try {
        const parsed = JSON.parse(stored) as CheckoutPayload;
        console.log("[Storage] Loaded from localStorage:", {
            cartId: parsed.cartMetadata?.cartId,
            passengerCount: parsed.passengerData?.length || 0,
            hasPassengerInfo:
                parsed.passengerData?.some((p) => p.givenName) || false,
        });
        return parsed;
    } catch (e) {
        console.error(
            "[Storage] Failed to parse checkout data from storage",
            e,
        );
        clearCheckoutStorage();
        return null;
    }
}

/**
 * Saves checkout data to localStorage
 */
export function saveCheckoutToStorage(data: CheckoutPayload): void {
    if (typeof window === "undefined") return;

    try {
        console.log("[Storage] Saving to localStorage:", {
            cartId: data.cartMetadata?.cartId,
            passengerCount: data.passengerData.length,
            hasPassengerInfo: data.passengerData.some((p) => p.givenName),
            paymentValid: data.payment.isPaymentValid,
            contactValid: data.payment.isContactValid,
        });
        localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(data));
        console.log("[Storage] Save successful");
    } catch (e) {
        console.error("[Storage] Failed to save checkout data to storage", e);
    }
}

/**
 * Clears checkout data from localStorage
 */
export function clearCheckoutStorage(): void {
    if (typeof window === "undefined") return;
    console.log("[Storage] Clearing localStorage");
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
}
