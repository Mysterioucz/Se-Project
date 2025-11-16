// Export all types
export type {
    BaggageAllowance,
    Cart,
    CartMetadata,
    CheckoutContextType,
    CheckoutPayload,
    Info,
    PassengerData,
    Payment,
    Seat,
    ServiceType,
} from "./types";

// Export constants
export {
    CHECKOUT_STORAGE_KEY,
    initialBaggageAllowance,
    initialCheckoutData,
    initialPassengerData,
    initialSeatSelection,
} from "./constants";

// Export validation functions
export {
    areAllSeatsSelected,
    validateCheckoutDataAgainstCart,
    validateStoredData,
} from "./validation";

// Export storage functions
export {
    clearCheckoutStorage,
    loadCheckoutFromStorage,
    saveCheckoutToStorage,
} from "./storage";

// Export helper functions
export {
    createCartMetadata,
    createEmptyPassenger,
    ensureCartMetadata,
    ensurePassengerListLength,
    isValidPassengerIndex,
    updatePassengerAtIndex,
    updatePassengerBaggageAtIndex,
    updatePassengerSeatAtIndex,
} from "./helpers";

// Export hooks
export { useCheckoutInitialization, useCheckoutPersistence } from "./hooks";
