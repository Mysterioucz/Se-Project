import {
    OneWayArrowIcon,
    TimeForwardIcon,
    TwoWayArrowIcon,
} from "@/src/components/icons/module";

export interface Flight {
    flightNumber: string;
    departureCity: string;
    departureTime: string;
    arrivalCity: string;
    arrivalTime: string;
    date: string;
    duration: string;
}

export interface BookingInfoProps {
    departure: Flight;
    arrival?: Flight;
}

function FlightContent({
    flight,
    headerText,
}: {
    flight: Flight;
    headerText: string;
}) {
    return (
        <div className="flex flex-col gap-3">
            {/* Header */}
            <div className="flex gap-4">
                {/* Tag */}
                <div className="flex text-center p-1 items-center justify-center w-fit h-6 rounded-sm bg-primary-50">
                    <p className="text-[0.75rem] text-primary-500 ">
                        {headerText}
                    </p>
                </div>
                {/* Date & Interval Time */}
                <div className="flex gap-4 ">
                    <p className="text-[0.75rem] text-gray-700">
                        {flight.date}
                    </p>
                    <div className="flex items-center gap-1">
                        <TimeForwardIcon />
                        <p className="text-[0.75rem] text-gray-700">
                            {flight.duration}
                        </p>
                    </div>
                </div>
            </div>
            {/* Flight Info */}
            {/* Timeline row: times | vertical connector | airport */}
            <div className="flex w-full items-center pl-4">
                {/* Left - times */}
                <div className="flex flex-col items-start w-fit gap-4">
                    <span className="text-base text-gray-600">
                        {flight.departureTime}
                    </span>
                    <span className="text-base text-gray-600">
                        {flight.arrivalTime}
                    </span>
                </div>

                {/* Middle - vertical line with two nodes */}
                <div className="flex flex-col items-center justify-center w-12 h-full">
                    <div
                        className="w-3 h-3 rounded-full bg-gray-100"
                        aria-hidden
                    />
                    <div className="w-[2px] bg-gray-100 h-[2rem]" aria-hidden />
                    <div
                        className="w-3 h-3 rounded-full bg-gray-100"
                        aria-hidden
                    />
                </div>

                {/* Right - airport code and date */}
                <div className="flex flex-col items-start gap-4">
                    <span className="text-base text-gray-400">
                        {flight.departureCity}
                    </span>
                    <span className="text-base text-gray-400">
                        {flight.arrivalCity}
                    </span>
                </div>
            </div>
        </div>
    );
}

function Content({ departure, arrival }: BookingInfoProps) {
    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex font-extrabold text-[1.125rem] text-primary-700 items-baseline gap-1">
                <span>{departure.departureCity}</span>
                {arrival ? <TwoWayArrowIcon /> : <OneWayArrowIcon />}
                <span>{departure.arrivalCity}</span>
            </div>
            <FlightContent flight={departure} headerText="Depart" />
            {arrival && <FlightContent flight={arrival} headerText="Return" />}
        </div>
    );
}

async function fetchBookingInfo(): Promise<BookingInfoProps> {
    // TODO: Replace with actual API call
    // Dummy price data
    const departure: Flight = {
        flightNumber: "AB123",
        departureCity: "New York",
        departureTime: "10:00 AM",
        arrivalCity: "Los Angeles",
        arrivalTime: "1:00 PM",
        date: "2023-10-01",
        duration: "6h",
    };

    const arrival: Flight = {
        flightNumber: "CD456",
        departureCity: "Los Angeles",
        departureTime: "3:00 PM",
        arrivalCity: "New York",
        arrivalTime: "10:00 PM",
        date: "2023-10-02",
        duration: "6h",
    };

    return { departure, arrival };
}

export default async function BookingInfo() {
    const { departure, arrival } = await fetchBookingInfo(); // This will suspend until the promise resolves
    return (
        <div className="flex flex-col gap-6 px-6 py-4 border-2 border-primary-300 rounded-lg w-full">
            <h2 className="font-semibold text-primary-900">
                Booking Information
            </h2>
            <Content departure={departure} arrival={arrival} />
        </div>
    );
}
