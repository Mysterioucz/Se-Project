import { FlightCardDivider } from "@/src/components/icons/module";
import { FlightDetailType } from "../../enums/FlightDetailType";

export default function FlightDetail({
    headerText,
    departAirport,
    arrivalAirport,
    departCity,
    arrivalCity,
    flight,
}: {
    headerText: string;
    departAirport: string;
    arrivalAirport: string;
    departCity: string;
    arrivalCity: string;
    flight: FlightDetailType;
}) {
    return (
        <div className="m-4">
            <div className="flex items-center text-sm text-gray-600">
                <div className="bg-primary-50 text-primary-400 w-16 rounded-lg text-center font-semibold">
                    {headerText}
                </div>
                <div className="text-primary-600 ml-4 text-2xl font-bold">
                    {flight?.AirlineName}
                </div>
                <div className="text-primary-400 ml-4 text-xl">
                    {formatToShortDate(flight?.DepartTime ?? null)}
                </div>
            </div>

            <div className="mx-10 my-1 flex items-center justify-between">
                <div className="text-left">
                    <div className="text-2xl font-bold text-black">
                        {formatToTime(flight?.DepartTime ?? null)}
                    </div>
                    <div className="text-md">{departAirport}</div>
                    <div className="text-md">{departCity}</div>
                </div>

                <div className="px-4 text-center text-black">
                    <div className="text-md">
                        {getFlightDuration(
                            flight?.DepartTime ?? null,
                            flight?.ArrivalTime ?? null,
                        )}
                    </div>
                    <FlightCardDivider />
                    {(flight?.Stops ?? 0) > 0 && (
                        <div className="text-sm text-black">
                            {flight?.Stops} Stops
                        </div>
                    )}
                    {(flight?.Stops ?? 0) == 0 && (
                        <div className="text-sm text-black">Nonstop</div>
                    )}
                </div>

                <div className="text-right text-black">
                    <div className="text-2xl font-bold text-black">
                        {formatToTime(flight?.ArrivalTime ?? null)}
                    </div>
                    <div className="text-md">{arrivalAirport}</div>
                    <div className="text-md">{arrivalCity}</div>
                </div>
            </div>
        </div>
    );
}

export function formatToShortDate(dateValue: Date | null): string {
    if (!dateValue) return "";

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });
}

export function formatToTime(dateValue: Date | null): string {
    if (!dateValue) return "";

    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
    });
}

export function getFlightDuration(
    departTime: Date | null,
    arrivalTime: Date | null,
): string {
    if (!departTime || !arrivalTime) return "";

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
