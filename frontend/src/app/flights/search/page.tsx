import FlightFilterTab from "@/src/components/flight_search/filter";
import FlightSearchBar from "@/src/components/flight_search/search";
import FlightSortTab from "@/src/components/flight_search/sort";
import FlightCard, {
    FlightCardProps,
} from "@/src/components/flightCard/flight_card";
import { mockFlightData } from "@/src/data/mockFlightData";

export default async function Page() {
    const HeaderText = "Departing Flights";
    // const flightData = await fetch("/api/v1/flights").then(
    //     (res) => res.json()
    // );

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
