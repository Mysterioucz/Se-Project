"use client";

import { useCheckout } from "@/src/contexts/CheckoutContext";
import BaggageAllowance from "./_components/baggageAllowance";
import InformationCard from "./_components/information_card";

export default function Page() {
    const cardTitle = ["Who's traveling?", "Baggage Allowance"];
    const { checkoutData,cartData } = useCheckout();
    const passengerData = checkoutData.passengerData || [];
    console.log("Passenger Data in Page:", passengerData);  
    const totalPassengers =
        cartData.Adults + cartData.Childrens + cartData.Infants;


    return (
        <div className="flex flex-col w-full h-fit gap-6">
            <span className="text-[3rem] font-bold">{cardTitle[0]}</span>
            {Array.from({ length: totalPassengers }, (_, i) => (
                <InformationCard passengerNum={i+1} key={i} passengerData={passengerData[i]}/>
            ))}
            <span className="text-[3rem] font-bold">{cardTitle[1]}</span>
            <BaggageAllowance passengersData={passengerData} />
        </div>
    );
}
