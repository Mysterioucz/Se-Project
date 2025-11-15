"use client";

import {
    formatToShortDate,
    formatToTime,
    getFlightDuration,
} from "@/src/components/booking/FlightDetail";
import {
    OneWayArrowIcon,
    TimeForwardIcon,
    TwoWayArrowIcon,
} from "@/src/components/icons/module";
import { useCheckout } from "@/src/contexts/CheckoutContext";

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
                <div className="bg-primary-50 flex h-6 w-fit items-center justify-center rounded-sm p-1 text-center">
                    <p className="text-primary-500 text-[0.75rem]">
                        {headerText}
                    </p>
                </div>
                {/* Date & Interval Time */}
                <div className="flex gap-4">
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
                <div className="flex w-fit flex-col items-start gap-4">
                    <span className="text-base text-gray-600">
                        {flight.departureTime}
                    </span>
                    <span className="text-base text-gray-600">
                        {flight.arrivalTime}
                    </span>
                </div>

                {/* Middle - vertical line with two nodes */}
                <div className="flex h-full w-12 flex-col items-center justify-center">
                    <div
                        className="h-3 w-3 rounded-full bg-gray-100"
                        aria-hidden
                    />
                    <div className="h-[2rem] w-[2px] bg-gray-100" aria-hidden />
                    <div
                        className="h-3 w-3 rounded-full bg-gray-100"
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
        <div className="flex flex-col gap-4">
            <div className="text-primary-700 flex items-baseline gap-1 text-[1.125rem] font-extrabold">
                <span>{departure.departureCity}</span>
                {arrival ? <TwoWayArrowIcon /> : <OneWayArrowIcon />}
                <span>{departure.arrivalCity}</span>
            </div>
            <FlightContent flight={departure} headerText="Depart" />
            {arrival && <FlightContent flight={arrival} headerText="Return" />}
        </div>
    );
}

export default function BookingInfo() {
    const { cartData, departFlight, returnFlight } = useCheckout();
    console.log(departFlight, returnFlight)
    // Map departFlight to Flight format
    const departure: Flight = {
        flightNumber: departFlight.FlightNo,
        departureCity: cartData.DepartureCity,
        departureTime: formatToTime(departFlight.DepartTime),
        arrivalCity: cartData.ArrivalCity,
        arrivalTime: formatToTime(departFlight.ArrivalTime),
        date: formatToShortDate(departFlight.DepartTime),
        duration: getFlightDuration(
            departFlight.DepartTime,
            departFlight.ArrivalTime,
        ),
    };

    // Map returnFlight to Flight format if it exists
    let arrival: Flight | undefined = undefined;
    if (returnFlight) {
        arrival = {
            flightNumber: returnFlight.FlightNo,
            departureCity: cartData.ArrivalCity,
            departureTime: formatToTime(returnFlight.DepartTime),
            arrivalCity: cartData.DepartureCity,
            arrivalTime: formatToTime(returnFlight.ArrivalTime),
            date: formatToShortDate(returnFlight.DepartTime),
            duration: getFlightDuration(
                returnFlight.DepartTime,
                returnFlight.ArrivalTime,
            ),
        };
    }

    return (
        <div className="border-primary-300 flex w-full flex-col gap-6 rounded-lg border-2 px-6 py-4">
            <h2 className="text-primary-900 font-semibold">
                Booking Information
            </h2>
            <Content departure={departure} arrival={arrival} />
        </div>
    );
}
