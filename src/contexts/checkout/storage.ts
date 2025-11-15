import { CheckoutPayload } from "./types";
import { CHECKOUT_STORAGE_KEY } from "./constants";

/**
 * Loads checkout data from localStorage
 */
export function loadCheckoutFromStorage(): CheckoutPayload | null {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored) as CheckoutPayload;
    } catch (e) {
        console.error("Failed to parse checkout data from storage", e);
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
        localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save checkout data to storage", e);
    }
}

/**
 * Clears checkout data from localStorage
 */
export function clearCheckoutStorage(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CHECKOUT_STORAGE_KEY);
}
