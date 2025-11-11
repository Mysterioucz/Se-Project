"use client";

import { formatToShortDate } from "@/src/app/flights/search/_components/SummaryCard";
import SelectSeatCard from "@/src/components/selectSeatCard/selectSeatCard";
import { Cart, useCheckout } from "@/src/contexts/CheckoutContext";
import { Flight } from "@/src/helper/CheckoutHelper";
import { useState } from "react";
import {
    formatToTime,
    getFlightDuration,
} from "@/src/components/booking/FlightDetail";

export default function Page() {
    const { cartData, departFlight, returnFlight } = useCheckout();

    function departSelectCard(flightData: Flight | undefined, cartData: Cart) {
        if (!flightData) {
            return <div>Loading...</div>;
        }
        return (
            <SelectSeatCard
                header="Departure"
                departFrom={flightData.DepartureAirportID}
                departFromFull=""
                arriveAt={flightData.ArrivalAirportID}
                departTime={formatToTime(cartData.Depart.DepartTime)}
                arriveTime={formatToTime(cartData.Depart.ArrivalTime)}
                duration={getFlightDuration(
                    cartData.Depart.DepartTime,
                    cartData.Depart.ArrivalTime,
                )}
                date={formatToShortDate(cartData.Depart.DepartTime)}
                passengerCount={
                    cartData.Adults + cartData.Childrens + cartData.Infants
                }
                passengerType="People"
                seatClass={cartData.ClassType}
            />
        );
    }

    function returnSelectCard(flightData: Flight | undefined, cartData: Cart) {
        if (!flightData) {
            return <div>Loading...</div>;
        }
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

    return (
        <div>
            <div className="flex flex-col">
                {departSelectCard(departFlight, cartData)}
                {cartData.Return && returnSelectCard(returnFlight, cartData)}
            </div>
        </div>
    );
}
