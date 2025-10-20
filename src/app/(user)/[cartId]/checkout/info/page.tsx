"use client";

import BaggageAllowance from "./_components/baggageAllowance";
import InformationCard from "./_components/information_card";

export default function Page() {
    const cardTitle = ["Who's traveling?", "Baggage Allowance"];

    return (
        <div className="flex flex-col w-full h-fit gap-6">
            <span className="text-[3rem] font-bold">{cardTitle[0]}</span>
            <InformationCard passengerIdx={0} />
            <span className="text-[3rem] font-bold">{cardTitle[1]}</span>
            <BaggageAllowance />
        </div>
    );
}
