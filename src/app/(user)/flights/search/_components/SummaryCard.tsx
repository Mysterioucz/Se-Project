import { FiSrPlane, FlightCardDivider } from "@/src/components/icons/module";
import { FlightDetailType } from "@/src/enums/FlightDetailType";
import { MappedFlightData } from "../helper";


export default function SummaryCard({ flight, date }: { 
    flight: MappedFlightData;
    date: Date | null;
} ) {
    
    return (<div className="mb-4">
        <div className="bg-primary-100 flex items-center p-2 px-4">
            <div className="text-xl text-primary-400 font-bold">{flight.airlineTimeStamp.depart.airport} to {flight.airlineTimeStamp.arrive.airport}</div>
            <div className="ml-3 text-primary-400 text-lg">{formatToShortDate(date)}</div>
        </div>

        <div className="flex items-center text-sm text-gray-600 m-3">
            <FiSrPlane className="" />
            <div className="ml-3 text-xl font-bold text-primary-600">{flight.airlineTimeStamp.airlineName}</div>
        </div>

        <div className="mx-20 flex items-center justify-between">
            <div className="text-left">
                <div className="text-2xl font-bold text-black">{flight.airlineTimeStamp.depart.time}</div>
                <div className="text-md">{flight.airlineTimeStamp.depart.airport}</div>
                <div className="text-md">{flight.airlineTimeStamp.depart.city}</div>
            </div>

            <div className="text-center px-4 text-black">
                <div className="text-md">{flight.airlineTimeStamp.duration}</div>
                <FlightCardDivider />
                {flight.airlineTimeStamp.stops > 0 && <div className="text-sm text-black">{flight?.airlineTimeStamp.stops} Stops</div>}
                {flight.airlineTimeStamp.stops == 0 && <div className="text-sm text-black">Nonstop</div>}
            </div>

            <div className="text-right text-black">
                <div className="text-2xl font-bold text-black">{flight.airlineTimeStamp.arrive.time}</div>
                <div className="text-md">{flight.airlineTimeStamp.arrive.airport}</div>
                <div className="text-md">{flight.airlineTimeStamp.arrive.city}</div>
            </div>
        </div>

    </div>);
}

export function formatToShortDate(dateValue: Date | null): string {
    if (! dateValue) return "";

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}