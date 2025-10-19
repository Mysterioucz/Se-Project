import {
    PassengerCount,
    SelectedValues,
} from "@/src/app/flights/search/_components/search";

export interface FlightData {
    airlineName: string;
    flightNo: string;
    departureAirportID: string;
    departCity: string;
    arrivalAirportID: string;
    arrivalCity: string;
    departureTime: Date; // "09:30"
    arrivalTime: Date; // "12:00"
    departHours: string;
    arrivalHours: string;
    duration: string; // "2h 30m"
    durationInMinutes: number;
    cabinClass: string;
    price: number;
    aircraftModel: string;
    seatCapacity: number;
    transitAmount: number; // Number of stops
}

// Define the structure for the mapped data
export interface MappedFlightData {
    airlineTimeStamp: {
        airlineName: string;
        depart: {
            date: Date;
            time: string;
            airport: string;
            city: string;
        };
        arrive: {
            date: Date;
            time: string;
            airport: string;
            city: string; 
        };
        duration: string;
        stops: number;
    };
    flightNo: string;
    passengers: PassengerCount;
    flightType: string;
    classType: string;
    priceCabinClass: {
        price: number;
        currency: string;
        cabinClass: string;
    };
}

export const INIT_SELECTED_VALUES: SelectedValues = {
    flight: "One Way",
    class: "Economy",
    leave: "Leaving From?",
    go: "Going to?",
};
export const INIT_PASSENGER_COUNT: PassengerCount = {
    adult: 1,
    children: 0,
    infants: 0,
};
export const INIT_SELECTED_START_DATE: Date | null = null;
export const INIT_SELECTED_END_DATE: Date | null = null;
export const INIT_SELECTED_AIRLINES: string[] = [];
export const INIT_DEPARTURE_TIME = [0, 24];
export const INIT_ARRIVAL_TIME = [0, 24];
export const INIT_SORT = "";
