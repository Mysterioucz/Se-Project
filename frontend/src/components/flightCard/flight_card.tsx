'use client';
import AirlineTimestamp, { AirlineTimestampProps } from "./airline_timestamp";
import PriceCabinClass, { PriceCabinClassProps } from "./price_cabin_class";

export interface FlightCardProps {
    id: string;
    airlineTimeStamp: AirlineTimestampProps;
    priceCabinClass: PriceCabinClassProps;
    onClick?: () => void;
}

export default function FlightCard({
    id,
    airlineTimeStamp,
    priceCabinClass,
    onClick,
}: FlightCardProps) {
    return (
        <div className="flex p-2 bg-primary-100 w-full  h-fit rounded-sm shadow-md text-nowrap">
            <AirlineTimestamp {...airlineTimeStamp} />
            <PriceCabinClass
                price={priceCabinClass.price}
                cabinClass={priceCabinClass.cabinClass}
                onClick={onClick}
            />
        </div>
    );
}
