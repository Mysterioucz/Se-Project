'use client';

import Button from "@components/Button";
import { FiSrPlane, FlightCardDivider } from "@components/icons/module";
import { useState } from "react";

interface SelectSeatCardProps {
    header: string;
    departFrom: string;
    departFromFull?: string;
    arriveAt: string;
    arriveAtFull?: string;
    departTime: string;
    arriveTime: string;
    duration: string;
    date: string;
    passengerCount: number;
    passengerType?: string;
    class: string;
}



export default function SelectSeatCard({ header, departFrom, departFromFull, arriveAt, arriveAtFull, departTime, arriveTime, duration, date, passengerCount, passengerType, class: seatClass }: SelectSeatCardProps){
    const [selected, setSelected] = useState(false);

    function PassengerName(index: any){
        return (
            <div className="flex w-[15.3125rem] h-[3.1875rem] rounded-2xl bg-primary-50">
                <div className="flex flex-row gap-2 justify-between items-center w-full px-4 py-[0.3125rem]">
                    <div className="flex min-w-8 h-8 p-[0.4375rem] rounded-lg bg-disable-main">
                        {/* TODO: implement passenger selection */}
                    </div>
                    <div className="w-[11.125rem] h-[2rem] rounded-lg p-[0.4375rem] bg-primary-100 items-center">
                        <p className="!text-[0.875rem] !text-primary-400">Passenger Name</p>
                    </div>
                </div>
            </div>
        )
    }

    function SeatMap(){
        return (
            <div className="flex px-6 bg-white w-full h-[27.0625rem] items-center justify-center">
                                <div className="flex flex-col gap-4 h-[24rem]">
                                    <div className="flex flex-row gap-5">
                                        {/* Seat Map */}
                                        <div className="flex flex-row w-[29.1875rem] rounded-2xl p-8 g-8 bg-primary-50 items-center justify-center">
                                            <div className="flex w-[2rem] h-[14.125rem] rounded-lg bg-white items-center justify-center">
                                                <p className="!text-[0.875rem] !text-primary-600 -rotate-90">Font</p>
                                            </div>
                                            <div className="flex flex-col gap-2 overflow-x-auto py-2 px-2">
                                                {[...Array(6)].map((_, rowIndex) => {
                                                    const letter = String.fromCharCode(70 - rowIndex); // 70 = 'F', then E, D, C, B, A
                                                    const row = (
                                                        <div key={letter} className="flex gap-4 items-center">
                                                            {[...Array(10)].map((_, colIndex) => (
                                                                // Seat
                                                                <div
                                                                    key={colIndex}
                                                                    className="min-w-8 min-h-8 p-[0.3125rem] bg-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-primary-100"
                                                                >
                                                                    <p className="!text-[0.875rem] !text-primary-600 -rotate-90">
                                                                        {colIndex + 1}{letter}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );

                                                    // insert a small spacer (blank line) between D and C (after the first 3 rows: F,E,D)
                                                    if (rowIndex === 3) {
                                                        return [
                                                            <div key="spacer" className="h-2" />,
                                                            row
                                                        ];
                                                    }

                                                    return row;
                                                })}
                                            </div>
                                        </div>

                                        {/* Passengers */}
                                        <div className="flex flex-col gap-4">
                                            {/* TODO: implement passenger selection to match seat selection */}
                                            {[...Array(passengerCount)].map((_, index) => (
                                                <PassengerName key={index} />
                                            ))}
                                        </div>
                                    </div>
                                    <Button
                                        text="Confirm"
                                        height="h-[2.0625rem]"
                                        width="w-[45.875rem]"
                                    />
                                </div>
                            </div>
        )
    }
    
    return (
        <div className="flex p-6 rounded-lg bg-primary-50 h-fit w-fit">
            {/* Content */}
            <div className="flex flex-col h-fit gap-4">
                <p className="!font-bold !text-[2rem]">{header}</p>
                {/* Box */}
                <div className="flex flex-col w-[49.3125rem] h-fit rounded-sm border-2 border-primary-300">
                    {/* Top part */}
                    <div className="flex py-2 px-4 bg-primary-300">
                        <p className="!font-semibold !text-[1.25rem] text-white">{header}: {departFrom} to {arriveAt}</p>
                    </div>
                    <div className="flex flex-row h-fit w-full">
                        {/* Left part */}
                        <div className="flex flex-col py-3 gap-3 w-[36rem] bg-primary-50">
                            <div className="flex px-4 gap-3 items-center">
                                <FiSrPlane />
                                <p className="!font-semibold !text-[1.25rem] !text-primary-600">Airline</p>
                                <p className="!text-[1rem] !text-primary-600">{date}</p>
                            </div>
                            <div className="flex flex-row px-8 pb-2 items-center">
                                <div className="flex flex-col w-[6.25rem] px-4 pb-2">
                                    <p className="!font-semibold !text-[1.5rem] !text-primary-600">{departTime}</p>
                                    <p className="!text-[1rem] !text-primary-600">{departFrom}</p>
                                    <p className="!text-[1rem] !text-primary-500">{departFromFull}</p>
                                </div>
                                <div className="flex flex-col w-fit py-1 px-2 gap-1 items-center">
                                    <p className="!text-[1rem] !text-primary-500">{duration}</p>
                                    <FlightCardDivider />
                                </div>
                                <div className="flex flex-col w-fit px-4 pb-2">
                                    <p className="!font-semibold !text-[1.5rem] !text-primary-600">{arriveTime}</p>
                                    <p className="!text-[1rem] !text-primary-600">{arriveAt}</p>
                                    <p className="!text-[1rem] !text-primary-500">{arriveAtFull}</p>
                                </div>
                            </div>
                        </div>
                        {/* Right part */}
                        <div className="flex flex-col w-[13.3125rem] h-auto px-4 gap-3 bg-primary-100 justify-center items-center">
                            <div className="flex flex-col gap-1 items-end w-full">
                                <p className="!text-[1rem] !text-primary-600">{passengerCount} {passengerType}</p>
                                <p className="!font-semibold !text-[1.125rem] !text-primary-600">{seatClass}</p>
                            </div>
                            <Button 
                                text="Select Seat"
                                height="h-[2.1875rem]"
                                width="w-[11.3125rem]"
                                onClick={() => setSelected(!selected)}
                            />
                        </div>
                    </div>
                    {/* Bottom part */}
                    { selected &&
                        <SeatMap />
                    }
                </div>
            </div>
        </div>
    )
}