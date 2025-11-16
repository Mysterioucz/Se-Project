import { Flight } from "../../helper/CheckoutHelper";

export interface Payment {
    isPaymentValid: boolean;
    isContactValid: boolean;
    isQRmethod: boolean;
    isQRModalOpen: boolean;
    email: string;
    telNo: string;
    bankName: string;
}

export interface Info {
    isValid: boolean;
}

export interface ServiceType {
    ServiceID: string;
    ServiceName: string;
    Price: number;
    Description: string;
}

export interface Seat {
    departureSeat: string;
    returnSeat?: string;
}

export interface BaggageAllowance {
    departureBaggage: ServiceType;
    returnBaggage?: ServiceType;
}

export interface PassengerData {
    givenName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    nationality: string;
    passportNo?: string;
    issueDate?: string;
    expiryDate?: string;
    baggageAllowance: BaggageAllowance;
    seatSelection: Seat;
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
    Return?: {
        FlightNo: string;
        DepartTime: Date;
        ArrivalTime: Date;
        AirlineName: string;
        Stops: number;
    };
}

export interface CartMetadata {
    cartId: number;
    flightType: string;
    totalPassengers: number;
    departFlightNo: string;
    returnFlightNo?: string;
}

export interface CheckoutPayload {
    passengerData: PassengerData[];
    payment: Payment;
    info: Info;
    cartMetadata?: CartMetadata;
}

export interface CheckoutContextType {
    checkoutData: CheckoutPayload;
    updateCheckoutData: (data: Partial<CheckoutPayload>) => void;
    updatePassengerAt: (
        index: number,
        passengerPatch: Partial<PassengerData>,
    ) => void;
    updatePassengerSeatAt: (index: number, seatPatch: Partial<Seat>) => void;
    updateBaggageAt: (
        index: number,
        baggagePatch: Partial<BaggageAllowance>,
    ) => void;
    clearCheckoutData: () => void;
    areAllSeatsSelected: () => boolean;
    isCheckoutDataValid: () => boolean;
    cartData: Cart;
    departFlight: Flight;
    returnFlight?: Flight;
}
