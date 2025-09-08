import FlightCard from "@/components/flightCard/flight_card";
import { mockFlightData } from "@/data/mockFlightData";

export default function Page() {
    return (
        <div className="flex flex-col p-8">
            <FlightCard
                airlineTimeStamp={mockFlightData.airlineTimeStamp}
                priceCabinClass={{
                    ...mockFlightData.priceCabinClass,
                    onClick: () => {},
                }}
            />
        </div>
    );
}
