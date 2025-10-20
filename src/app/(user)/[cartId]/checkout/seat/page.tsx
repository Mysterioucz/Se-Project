"use client";

import { formatToShortDate } from "@/src/app/flights/search/_components/SummaryCard";
import SelectSeatCard from "@/src/components/selectSeatCard/selectSeatCard";
import { Cart, useCheckout } from "@/src/contexts/CheckoutContext";
import { Flight } from "@/src/generated/prisma";
import {
    formatToTime,
    getFlightDuration,
} from "../../../cart/[AccountID]/_components/FlightDetail";
import { useEffect, useState } from "react";
import { de } from "zod/v4/locales";

async function fetchFlightData(
    flightNo: string,
    departureTime: string,
    arrivalTime: string,
): Promise<Flight> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/flights/lookup?flightNo=${flightNo}&departTime=${departureTime}&arrivalTime=${arrivalTime}`,
    );
    const data = await response.json();
    return data.flight as Flight;
}



export default function Page() {
    const { cartData } = useCheckout();
    const [departFlight, setDepartFlight] = useState<Flight | undefined>(undefined);
    const [returnFlight, setReturnFlight] = useState<Flight | undefined>(undefined);
    
    function departSelectCard(flightData: Flight | undefined, cartData: Cart) {
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

    useEffect(() => {
       fetchFlightData(
            cartData.Depart.FlightNo,
            cartData.Depart.DepartTime,
            cartData.Depart.ArrivalTime,
        ).then((data) => {
            setDepartFlight(data);
        });

        if (
            cartData.Return
        ) {
            fetchFlightData(
                cartData.Return.FlightNo,
                cartData.Return.DepartTime,
                cartData.Return.ArrivalTime,
            ).then((data) => {
                setReturnFlight(data);
            });
        }
    }, [cartData]);


    return (
        <div>
            <div className="flex flex-col">
                {departSelectCard(departFlight, cartData)}
                {cartData.Return && returnSelectCard(returnFlight, cartData)}
            </div>
        </div>
    );
}
