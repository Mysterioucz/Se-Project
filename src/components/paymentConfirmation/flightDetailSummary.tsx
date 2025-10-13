import Image from "next/image";
import { FlightLegTypes } from "@/src/enums/FlightLegTypes";

function DepartureComponent() {
    return (
        <div>Departure Component</div>
    );
}

function ArrivalComponent() {
    return (
        <div>Arrival Component</div>
    );
}

function DepartureTransferComponent() {
    return (
        <div>Departure Transfer Component</div>
    );
}

function ArrivalTransferComponent() {
    return (
        <div>Arrival Transfer Component</div>
    );
}   

export default function FlightDetailSummary() {
  return (
    <div className="flex flex-col items-start self-stretch rounded-md border-[0.125rem] border-primary-300 bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center self-stretch px-4 py-2 gap-[0.75rem] bg-primary-300">
            <div className="flex items-center justify-center p-1 rounded-sm bg-primary-50">
                <span className="font-sarabun text-[0.75rem] font-normal leading-[120%] text-primary-500">
                    Depart
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
                    DeparturePlace ⇒ ArrivalPlace
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
                    Airline
                </span>
            </div>

            <div className="flex flex-col items-start pl-16 gap-1">
                <span className="font-sarabun text-[1rem] font-bold leading-[120%] text-primary-600">
                    Departure
                </span>
                <div className="flex flex-col items-start pl-6 pr-2">
                    <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                        14:50
                    </span>
                    <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                        Thu, Oct 14
                    </span>
                    <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                        BKK, Bangkok
                    </span>
                    <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                        Suvarnabhumi Airport
                    </span>
                </div>
                <span className="font-sarabun text-[1rem] font-bold leading-[120%] text-primary-600">
                    Arrival
                </span>
                <div className="flex flex-col items-start pl-6 pr-2">
                    <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                        16:00
                    </span>
                    <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                        Thu, Oct 14
                    </span>
                    <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                        CNX, Chiang Mai
                    </span>
                    <span className="font-sarabun text-[1rem] font-normal leading-[120%] text-black">
                        Chiang Mai Airport
                    </span>
                </div>
            </div>

            <div className="flex flex-col justify-center items-start self-stretch px-4 py-[0.75rem] gap-[0.75rem] bg-primary-50">
                <span className="font-sarabun text-[1rem] leading-[120%] text-primary-600">
                    <span className="font-bold">Flight Number: </span>
                    <span className="font-normal">123456789A</span>
                </span>

                <span className="font-sarabun text-[1rem] leading-[120%] text-primary-600">
                    <span className="font-bold">Cabin Class: </span>
                    <span className="font-normal">Economy</span>
                </span>

                <span className="font-sarabun text-[1rem] leading-[120%] text-primary-600">
                    <span className="font-bold">Duration: </span>
                    <span className="font-normal">1h 10m</span>
                </span>
            </div>
            
        </div>

    </div>
  );
}