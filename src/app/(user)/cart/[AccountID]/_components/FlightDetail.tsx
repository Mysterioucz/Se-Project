import { FiSrPlane, FlightCardDivider } from "@/src/components/icons/module";
import { CartType } from "../../../../../enums/CartType";
import { FlightDetailType } from "../../../../../enums/FlightDetailType";

export default function FlightDetail({ headerText, departAirport, arrivalAirport, departCity, arrivalCity, flight }: { 
    headerText: string,
    departAirport: string,
    arrivalAirport: string,
    departCity: string,
    arrivalCity: string,
    flight: FlightDetailType
} ) {
    
    return (<div className="m-4">
        <div className="flex items-center text-sm text-gray-600">
            <div className="w-16 bg-primary-50 text-center rounded-lg text-primary-400 font-semibold">{headerText}</div>
            <div className="ml-4 text-2xl font-bold text-primary-600">{flight?.AirlineName}</div>
            <div className="ml-4 text-primary-400 text-xl">{formatToShortDate(flight?.DepartTime ?? null)}</div>
        </div>

        <div className="my-1 mx-10 flex items-center justify-between">
            <div className="text-left">
                <div className="text-2xl font-bold text-black">{formatToTime(flight?.DepartTime ?? null)}</div>
                <div className="text-md">{departAirport}</div>
                <div className="text-md">{departCity}</div>
            </div>

            <div className="text-center px-4 text-black">
                <div className="text-md">{getFlightDuration(flight?.DepartTime ?? null, flight?.ArrivalTime ?? null)}</div>
                <FlightCardDivider />
                {(flight?.Stops ?? 0) > 0 && <div className="text-sm text-black">{flight?.Stops} Stops</div>}
                {(flight?.Stops ?? 0) == 0 && <div className="text-sm text-black">Nonstop</div>}
            </div>

            <div className="text-right text-black">
                <div className="text-2xl font-bold text-black">{formatToTime(flight?.ArrivalTime ?? null)}</div>
                <div className="text-md">{arrivalAirport}</div>
                <div className="text-md">{arrivalCity}</div>
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

export function formatToTime(dateValue: Date | null): string {
    if (! dateValue) return "";

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function getFlightDuration(
    departTime: Date | null,
    arrivalTime: Date | null
): string {
    if (! departTime || ! arrivalTime) return "";

    const depart = new Date(departTime);
    const arrival = new Date(arrivalTime);

    if (isNaN(depart.getTime()) || isNaN(arrival.getTime())) return "";

    const diffMs = arrival.getTime() - depart.getTime();
    if (diffMs < 0) return ""; // handle invalid negative durations

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
}