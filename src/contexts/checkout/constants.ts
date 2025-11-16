import {
    BaggageAllowance,
    CheckoutPayload,
    PassengerData,
    Seat,
} from "./types";

export const CHECKOUT_STORAGE_KEY = "tempCheckout";

export const initialBaggageAllowance: BaggageAllowance = {
    departureBaggage: {
        ServiceID: "",
        ServiceName: "",
        Price: 0,
        Description: "",
    },
};

export const initialSeatSelection: Seat = {
    departureSeat: "",
};

export const initialPassengerData: PassengerData = {
    givenName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    nationality: "",
    passportNo: "",
    issueDate: "",
    expiryDate: "",
    baggageAllowance: initialBaggageAllowance,
    seatSelection: initialSeatSelection,
};

export const initialCheckoutData: CheckoutPayload = {
    passengerData: [initialPassengerData],
    payment: {
        isPaymentValid: false,
        isContactValid: false,
        isQRmethod: false,
        isQRModalOpen: false,
        email: "",
        telNo: "",
        bankName: "",
    },
    info: {
        isValid: false,
    },
};
