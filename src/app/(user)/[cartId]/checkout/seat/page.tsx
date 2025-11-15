"use client";

import { formatToShortDate } from "@/src/app/(user)/flights/search/_components/SummaryCard";
import {
    formatToTime,
    getFlightDuration,
} from "@/src/components/booking/FlightDetail";
import SelectSeatCard from "@/src/app/(user)/[cartId]/checkout/seat/_components/selectSeatCard";
import { Cart } from "@/src/contexts/checkout/types";
import { useCheckout } from "@/src/contexts/CheckoutContext";
import { Flight } from "@/src/helper/CheckoutHelper";

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
                flightData={flightData}
            />
        );
    }

    function returnSelectCard(flightData: Flight | undefined, cartData: Cart) {
        if (!flightData || !cartData.Return) {
            return null;
        }
        return (
            <SelectSeatCard
                header="Return"
                departFrom={flightData.DepartureAirportID}
                departFromFull=""
                arriveAt={flightData.ArrivalAirportID}
                departTime={formatToTime(cartData.Return.DepartTime)}
                arriveTime={formatToTime(cartData.Return.ArrivalTime)}
                duration={getFlightDuration(
                    cartData.Return.DepartTime,
                    cartData.Return.ArrivalTime,
                )}
                date={formatToShortDate(cartData.Return.DepartTime)}
                passengerCount={
                    cartData.Adults + cartData.Childrens + cartData.Infants
                }
                passengerType="People"
                seatClass={cartData.ClassType}
                flightData={flightData}
            />
        );
    }

    return (
        <div>
            <div className="flex flex-col gap-6">
                {departSelectCard(departFlight, cartData)}
                {returnFlight &&
                    cartData.Return &&
                    returnSelectCard(returnFlight, cartData)}
            </div>
        </div>
    );
}
