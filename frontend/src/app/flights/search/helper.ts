export interface FlightData {
    airlineName: string;
    flightNo: string;
    departureAirportID: string;
    departCity: string;
    arrivalAirportID: string;
    arrivalCity: string;
    departureTime: string; // "09:30"
    arrivalTime: string; // "12:00"
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
            time: string;
            airport: string;
            city: string; // You might need a mapping for cities
        };
        arrive: {
            time: string;
            airport: string;
            city: string; // You might need a mapping for cities
        };
        duration: string;
        stops: number;
    };
    priceCabinClass: {
        price: number;
        currency: string;
        cabinClass: string;
    };
}

export const INIT_SELECTED_VALUES = {
    flight: "Flight type",
    class: "Class type",
    leave: "Leaving From?",
    go: "Going to?",
};
export const INIT_PASSENGER_COUNT = {
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