'use client'
import prisma from "@/db";
import FlightFilterTab from "@/src/components/flight_search/Filter";
import FlightSearchBar from "@/src/components/flight_search/Search";
import FlightSortTab from "@/src/components/flight_search/Sort";
import FlightCard from "@/src/components/flightCard/flight_card";
import { mockFlightData } from "@/src/data/mockFlightData";
import { Flight } from "@/src/generated/prisma";
import { useEffect, useState } from "react";

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

export default function Page({
    searchParams,
}: {
    searchParams: URLSearchParams;
}) {
    const HeaderText = "Departing Flights";

    const [selectedValues, setSelectedValues] = useState({
        flight: 'Flight type',  // default value for flight type
        class: 'Class type',      // default value for class type
        leave: 'Leaving From?',  // default value for leaving from
        go: 'Going to?',   // default value for going to
    });
    const [passengerCount, setPassengerCount] = useState({
        adult: 1,
        children: 0,
        infants: 0,
    });
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

    const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
    const [departureTime, setDepartureTime] = useState([0, 24]);
    const [arrivalTime, setArrivalTime] = useState([0, 24]);
    
    const [sort, setSort] = useState<string>("");

    const [convertedFlightData, setConvertedFlightData] = useState<MappedFlightData[]>([]); // State for storing converted flight data
    const fetchData = async () => {
        console.log(`Fetch called`)
        let totalPassenger = passengerCount.adult + passengerCount.children + passengerCount.infants;
        try {
            const url = new URL(`${process.env.API_URL}/api/v1/flights`); // Base URL for API
            const params = new URLSearchParams();
            
            // Search
            if (selectedValues.flight != 'Flight type') params.append(`flightType`, selectedValues.flight);
            if (selectedValues.class != 'Class type') params.append(`classType`, selectedValues.class);
            if (selectedValues.leave != `Leaving from?`) params.append(`departureCity`, selectedValues.leave);
            if (selectedValues.go != `Going to?`) params.append(`arrivalCity`, selectedValues.go);
            if (selectedStartDate) {
                const departDate = selectedStartDate.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD'
                params.append('departDate', departDate);
            }

            if (selectedEndDate) {
                const returnDate = selectedEndDate.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD'
                params.append('returnDate', returnDate);
            }
            params.append(`numberOfPassenger`, totalPassenger.toString());
            // Filter
            if (selectedAirlines.length > 0) params.append('airlines', selectedAirlines.join(','));
            params.append(`departureTimeRange`, departureTime.join(`,`));
            params.append(`arrivalTimeRange`, arrivalTime.join(`,`));
            // Sort
            if (sort !== "") params.append(`sortBy`, sort);
          
            const flightData = await fetch(url.toString() + `?${params.toString()}`, {
                method: 'GET',
            }).then((res) => res.json());

            //REMOVE
            console.log(flightData);
            
            // Transform data to match FlightCard
            const convertedData = flightData.data.map((flight: FlightData) => ({
                airlineTimeStamp: {
                    airlineName: flight.airlineName,
                    depart: {
                        time: flight.departHours,
                        airport: flight.departureAirportID,
                        city: flight.departCity,
                    },
                    arrive: {
                        time: flight.arrivalHours,
                        airport: flight.arrivalAirportID,
                        city: flight.arrivalCity,
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
            setConvertedFlightData(convertedData);
        } catch(err) {
            console.log(`Failed to fetch flights' data`, err);
        }
    };
    
    return (
        <div className="flex flex-col gap-4">
            <FlightSearchBar 
            headerText={HeaderText} 
            selectedValues={selectedValues}
            setSelectedValues={setSelectedValues}
            passengerCount={passengerCount}
            setPassengerCount={setPassengerCount}
            selectedStartDate={selectedStartDate}
            setSelectedStartDate={setSelectedStartDate}
            selectedEndDate={selectedEndDate}
            setSelectedEndDate={setSelectedEndDate}
            onSearch={fetchData}
            />

            <div className="flex w-full gap-4">
                <FlightFilterTab 
                selectedAirlines={selectedAirlines}
                setSelectedAirlines={setSelectedAirlines}
                departureTime={departureTime}
                setDepartureTime={setDepartureTime}
                arrivalTime={arrivalTime}
                setArrivalTime={setArrivalTime}
                handleApply={fetchData}
                />
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
                <FlightSortTab
                sort={sort}
                setSort={setSort} 
                />
            </div>
        </div>
    );
}
