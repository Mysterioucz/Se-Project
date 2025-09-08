import { FiSrPlane, FlightCardDivider } from "../icons/module";

interface FlightSegment {
    time: string;
    airport: string;
    city: string;
}

export interface AirlineTimestampProps {
    airlineName: string;
    depart: FlightSegment;
    arrive: FlightSegment;
    duration: string;
    stops?: number;
}

function AirlineName({ airlineName }: { airlineName: string }) {
    return (
        <div className="flex">
            <FiSrPlane />
            <h2 className="text-primary-600">{airlineName}</h2>
        </div>
    );
}

function FlightTimestamp({
    depart,
    arrive,
    duration,
    stops = 0,
}: {
    depart: FlightSegment;
    arrive: FlightSegment;
    duration: string;
    stops?: number;
}) {
    return (
        <div className="flex pl-8 pr-8">
            <div className="flex flex-col gap-1 pl-4 pr-4 pb-2">
                <h2>{depart.time}</h2>
                <p>{depart.airport}</p>
                <p>{depart.city}</p>
            </div>
            <div className="flex flex-col pr-2 pl-2 pb-1 pt-1 gap-1 justify-center">
                <p className="text-xs">{duration}</p>
                <FlightCardDivider />
                <p className="text-xs">
                    {stops
                        ? stops.toString() + " stop" + (stops === 1 ? "" : "s")
                        : "Direct"}
                </p>
            </div>
            <div className="flex flex-col gap-1 pl-4 pr-4 pb-2">
                <h2>{arrive.time}</h2>
                <p>{arrive.airport}</p>
                <p>{arrive.city}</p>
            </div>
        </div>
    );
}

function AirlineTimestamp(props: AirlineTimestampProps) {
    return (
        <div className="flex flex-col p-4 bg-common-white">
            <AirlineName airlineName={props.airlineName} />
            <FlightTimestamp
                depart={props.depart}
                arrive={props.arrive}
                duration={props.duration}
                stops={props.stops}
            />
        </div>
    );
}
export default AirlineTimestamp;
