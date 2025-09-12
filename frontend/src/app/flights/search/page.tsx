import FlightFilterTab from "@/src/components/flight_search/filter";
import FlightSearchBar from "@/src/components/flight_search/search";
import FlightSortTab from "@/src/components/flight_search/sort";
import FlightCard from "@/src/components/flightCard/flight_card";
import { mockFlightData } from "@/src/data/mockFlightData";

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
            "/api/v1/flights" +
            "?departureAirport=BKK&arrivalAirport=HKT&departDate=2024-12-25&numberOfPassenger=1",
        {
            method: "GET",
        }
    ).then((res) => res.json());
    console.log(flightData);

    return (
        <div className="flex flex-col gap-4">
            <FlightSearchBar headerText={HeaderText} />
            <div className="flex w-full gap-4">
                <FlightFilterTab />
                <div className="flex flex-col gap-4 overflow-y-auto">
                    {mockFlightData.map((flight, index) => (
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
