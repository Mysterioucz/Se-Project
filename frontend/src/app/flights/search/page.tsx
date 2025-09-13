import FlightFilterTab from "@/src/components/flight_search/filter";
import FlightSearchBar from "@/src/components/flight_search/search";
import FlightSortTab from "@/src/components/flight_search/sort";
import FlightCard from "@/src/components/flightCard/flight_card";
import { mockFlightData } from "@/src/data/mockFlightData";
import { Flight } from "@/src/generated/prisma";

interface FlightData {
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
interface MappedFlightData {
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

async function handleSearch(searchParams: URLSearchParams) {
    const departureAirport = searchParams.get("departureAirport");
    const arrivalAirport = searchParams.get("arrivalAirport");
    const departDate = searchParams.get("departDate");
    const numberOfPassenger = searchParams.get("numberOfPassenger");

    let flightData;
    if (departureAirport && arrivalAirport && departDate && numberOfPassenger) {
        // Perform search or API call with the collected parameters
        try {
            flightData = await fetch(
                process.env.API_URL +
                    "/api/v1/flights" +
                    searchParams.toString(),
                {
                    method: "GET",
                }
            ).then((res) => res.json());
        } catch (e) {
            console.error("Failed to fetch flight data:", e);
        }
    }
    return flightData;
}

export default async function Page({
    searchParams,
}: {
    searchParams: URLSearchParams;
}) {
    const HeaderText = "Departing Flights";
    // Fetch flight data example
    const flightData = await fetch(
        process.env.API_URL +
            `/api/v1/flights` +
            `?departureCity=Bangkok&arrivalCity=Tokyo&departDate=2025-09-14&numberOfPassenger=1`,
        {
            method: "GET",
        }
    ).then((res) => res.json());
    console.log(flightData);

    // Convert the returned flight to suit the flight card
    const convertedFlightData = flightData.data.map((flight: FlightData) => ({
        airlineTimeStamp: {
            airlineName: flight.airlineName,
            depart: {
                time: flight.departHours, // Assuming departureTime is a string like "09:30"
                airport: flight.departureAirportID, // Assuming this is the IATA code like "SIN"
                city: flight.departCity, // You can map it to the city based on your data
            },
            arrive: {
                time: flight.arrivalHours, // Assuming arrivalTime is a string like "12:00"
                airport: flight.arrivalAirportID, // Assuming this is the IATA code like "NRT"
                city: flight.arrivalCity, // You can map it to the city based on your data
            },
            duration: flight.duration,
            stops: flight.transitAmount,
        },
        priceCabinClass: {
            price: flight.price,
            currency: 'USD',
            cabinClass: flight.cabinClass,
        },
    }));

    return (
        <div className="flex flex-col gap-4">
            <FlightSearchBar headerText={HeaderText} />
            <div className="flex w-full gap-4">
                <FlightFilterTab />
                <div className="flex flex-col gap-4 overflow-y-auto">
                    {convertedFlightData.map((flight: MappedFlightData, index: number) => (
                        <FlightCard
                            key={index}
                            id={index.toString()}
                            airlineTimeStamp={flight.airlineTimeStamp}
                            priceCabinClass={flight.priceCabinClass}
                        />
                    ))}
                </div>
                <FlightSortTab />
            </div>
        </div>
    );
}
