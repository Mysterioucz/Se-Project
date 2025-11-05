import Image from "next/image";
import { FlightLegTypes } from "@/src/enums/FlightLegTypes";

interface FlightSegment {
    Time: string;
    Date: string;
    Airport: string;
    Place: string;
}

interface FlightDetailSummaryProps {
    flightLeg: FlightLegTypes; // One Way - Round Trip
    departurePlace: string;
    arrivalPlace: string;
    airline: string;
    flightNumber: string;
    cabinClass: string;
    segments: FlightSegment[]; // array of connected segments
}

function durationCalculation(segments: FlightSegment[]): string {
    if (!segments || segments.length === 0) return "0h 0m";

    const firstSeg = segments[0];
    const lastSeg = segments[segments.length - 1];

    const start = new Date(`${firstSeg.Date}T${firstSeg.Time}`);
    const end = new Date(`${lastSeg.Date}T${lastSeg.Time}`);

    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return "0h 0m";

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}h ${minutes}m`;
}

function DepartureComponent({ seg }: { seg: FlightSegment }) {
    return (
        <div className="flex flex-col gap-1">
        <span className="font-sarabun text-[1rem] font-bold leading-[120%] text-primary-600">
            Departure
        </span>
        <div className="flex flex-col items-start pl-6 pr-2">
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Time}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Date}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Place}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Airport}
            </span>
        </div>
        </div>
    );
}


function ArrivalComponent({ seg }: { seg: FlightSegment }) {
    return (
        <div className="flex flex-col gap-1">
        <span className="font-sarabun text-[1rem] font-bold leading-[120%] text-primary-600">
            Arrival
        </span>
        <div className="flex flex-col items-start pl-6 pr-2">
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Time}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Date}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Place}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Airport}
            </span>
        </div>
        </div>
    );
}

function DepartureTransferComponent({ seg }: { seg: FlightSegment }) {
    return (
        <div className="flex flex-col gap-1">
        <span className="font-sarabun text-[1rem] font-bold leading-[120%] text-primary-600">
            Depart From Transfer Airport
        </span>
        <div className="flex flex-col items-start pl-6 pr-2">
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Time}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Date}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Place}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Airport}
            </span>
        </div>
        </div>
    );
}

function ArrivalTransferComponent({ seg }: { seg: FlightSegment }) {
    return (
        <div className="flex flex-col gap-1">
        <span className="font-sarabun text-[1rem] font-bold leading-[120%] text-primary-600">
            Arrive At Transfer Airport
        </span>
        <div className="flex flex-col items-start pl-6 pr-2">
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Time}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Date}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Place}
            </span>
            <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                {seg.Airport}
            </span>
        </div>
        </div>
    );
}   

export default function FlightDetailSummary({flightLeg, departurePlace, arrivalPlace, airline, flightNumber, cabinClass, segments}: FlightDetailSummaryProps) {
  return (
    <div className="flex flex-col items-start self-stretch rounded-md border-[0.125rem] border-primary-300 bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center self-stretch px-4 py-2 gap-[0.75rem] bg-primary-300">
            <div className="flex items-center justify-center p-1 rounded-sm bg-primary-50">
                <span className="font-sarabun text-[0.75rem] font-normal leading-[120%] text-primary-500">
                    {flightLeg}
                </span>
            </div>
            <div className="font-sarabun text-[1.25rem] font-semibold leading-[120%] text-white">
                Flight Detail
            </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-col items-start self-stretch pt-2 gap-2">
            <div className="flex items-center self-stretch px-4">
                <span className="font-sarabun text-[1.125rem] font-semibold leading-[120%] text-primary-600">
                    {departurePlace} ⇒ {arrivalPlace}
                </span>
            </div>

            <div className="flex items-center self-stretch px-4 py-1 gap-[0.75rem] bg-primary-50">
                <Image
                    src="/fi-sr-plane.svg"
                    alt="Logo"
                    width={24}
                    height={24}
                />
                <span className="font-sarabun text-[1.25rem] font-semibold leading-[120%] text-primary-600">
                    {airline}
                </span>
            </div>

            <div className="flex flex-col items-start pl-16 gap-1">
                {segments.map((seg, idx) => {
                    if (idx === 0) {
                    return <DepartureComponent key={idx} seg={seg} />;
                    } else if (idx === segments.length - 1) {
                    return <ArrivalComponent key={idx} seg={seg} />;
                    } else {
                        if (idx % 2 === 1) {
                            return <ArrivalTransferComponent key={idx} seg={seg} />;
                        } else {
                            return <DepartureTransferComponent key={idx} seg={seg} />;
                        }
                    }
                })}
            </div>

            <div className="flex flex-col justify-center items-start self-stretch px-4 py-[0.75rem] gap-[0.75rem] bg-primary-50">
                <span className="font-sarabun text-[1rem] leading-[120%] text-primary-600">
                    <span className="font-bold">Flight Number: </span>
                    <span className="font-normal">{flightNumber}</span>
                </span>

                <span className="font-sarabun text-[1rem] leading-[120%] text-primary-600">
                    <span className="font-bold">Cabin Class: </span>
                    <span className="font-normal">{cabinClass}</span>
                </span>

                <span className="font-sarabun text-[1rem] leading-[120%] text-primary-600">
                    <span className="font-bold">Duration: </span>
                    <span className="font-normal">{durationCalculation(segments)}</span>
                </span>
            </div>
            
        </div>

    </div>
  );
}