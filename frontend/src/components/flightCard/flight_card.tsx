import AirlineTimestamp, { AirlineTimestampProps } from "./airline_timestamp";
import PriceCabinClass, { PriceCabinClassProps } from "./price_cabin_class";

interface Props {
    airlineTimeStamp: AirlineTimestampProps;
    priceCabinClass: PriceCabinClassProps;
}

export default function FlightCard({
    airlineTimeStamp,
    priceCabinClass,
}: Props) {
    return (
        <div className="flex p-2 bg-primary-100">
            <AirlineTimestamp {...airlineTimeStamp} />
            <PriceCabinClass {...priceCabinClass} />
        </div>
    );
}
