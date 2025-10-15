import { FlightCardDivider } from "@/src/components/icons/module";
import { CartType } from "../enums/CartType";

export default function FlightDetail({ item }: { item: CartType } ) {
    const formattedDepartDate = formatToShortDate(item.Depart.DepartTime);
    

    return (<div className="mt-2">
        <div className="flex items-center text-sm font-semibold text-gray-600">
            <div className="w-16">Depart</div>
            <div className="ml-4 text-primary-600">{item.Depart.AirlineName}</div>
            <div className="ml-auto text-gprimary-400">{formattedDepartDate}</div>
        </div>

        <div className="mt-4 flex items-center justify-between">
            <div className="text-left">
                <div className="text-2xl font-bold text-gray-800">{formatToTime(item.Depart.DepartTime)}</div>
                <div className="text-sm font-semibold">{item.DepartureAirport}</div>
                <div className="text-xs text-gray-500">{item.DepartureCity}</div>
            </div>

            <div className="flex-grow text-center px-4 text-sm text-black">
                <div className="">{getFlightDuration(item.Depart.DepartTime, item.Depart.ArrivalTime)}</div>
            <div className="relative h-px bg-gray-300 my-1">
                <FlightCardDivider className="w-4 h-4 text-primary-600 bg-white p-0.5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
                {item.Depart.Stops > 0 && <div className="text-sm text-black">{item.Depart.Stops} Stops</div>}
            </div>

            <div className="text-right text-black">
                <div className="text-2xl font-bold">{formatToTime(item.Depart.ArrivalTime)}</div>
                <div className="">{item.ArrivalAirport}</div>
                <div className="">{item.ArrivalCity}</div>
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

export function formatToTime(dateValue: Date | string): string {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

export function getFlightDuration(
    departTime: Date,
    arrivalTime: Date
): string {
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