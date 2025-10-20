"use client";

import { formatToShortDate } from "@/src/app/flights/search/_components/SummaryCard";
import SelectSeatCard from "@/src/components/selectSeatCard/selectSeatCard";
import { useCheckout } from "@/src/contexts/CheckoutContext";
import { Cart, Flight } from "@/src/generated/prisma";
import {
    formatToTime,
    getFlightDuration,
} from "../../../cart/[AccountID]/_components/FlightDetail";

async function fetchFlightData(
    flightNo: string,
    departureTime: Date,
    arrivalTime: Date,
): Promise<Flight> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/flights/lookup?flightNo=${flightNo}&departureTime=${departureTime.toISOString()}&arrivalTime=${arrivalTime.toISOString()}`,
    );
    const data = await response.json();
    return data.flight as Flight;
}

function departSelectCard(flightData: Flight, cartData: Cart) {
    return (
        <SelectSeatCard
            header={flightData.FlightNo}
            departFrom={flightData.DepartureAirportID}
            departFromFull=""
            arriveAt={flightData.ArrivalAirportID}
            departTime={formatToTime(flightData.DepartTime)}
            arriveTime={formatToTime(flightData.ArrivalTime)}
            duration={getFlightDuration(
                flightData.DepartTime,
                flightData.ArrivalTime,
            )}
            date={formatToShortDate(flightData.DepartTime)}
            passengerCount={
                cartData.Adults + cartData.Childrens + cartData.Infants
            }
            passengerType="People"
            seatClass={cartData.ClassType}
        />
    );
}

export default function Page() {
    const { cartData } = useCheckout();
    const departFlight = fetchFlightData(
        cartData.DepartFlightNo,
        cartData.DepartFlightDepartTime,
        cartData.DepartFlightArrivalTime,
    );
    let returnFlight = undefined;
    if (
        cartData.ReturnFlightNo &&
        cartData.ReturnFlightDepartTime &&
        cartData.ReturnFlightArrivalTime
    ) {
        returnFlight = fetchFlightData(
            cartData.ReturnFlightNo,
            cartData.ReturnFlightDepartTime,
            cartData.ReturnFlightArrivalTime,
        );
    }

    return <div></div>;
}
