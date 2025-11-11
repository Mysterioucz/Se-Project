"use client"
import {
    formatToShortDate,
    formatToTime,
    getFlightDuration,
} from "@/src/components/booking/FlightDetail";
import SelectSeatCard from "@/src/components/selectSeatCard/selectSeatCard";
import { Cart } from "@/src/contexts/CheckoutContext";
import { Flight } from "@/src/helper/CheckoutHelper";

interface props {
    flightData: Flight;
    cartData: Cart;
}

export default function DepartCard({ flightData, cartData }: props) {
    return (
        <SelectSeatCard
            key={`${flightData.FlightNo}-${flightData.DepartTime}`}
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
