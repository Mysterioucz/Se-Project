"use client";

import {
    CHECKOUT_STORAGE_KEY,
    PassengerData,
    useCheckout,
} from "@/src/contexts/CheckoutContext";
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
    seatClass: string;
}

function getPassengerData() {
    if (window !== undefined) {
        const storedData = localStorage.getItem(CHECKOUT_STORAGE_KEY);
        if (storedData) {
            const checkoutData = JSON.parse(storedData);
            const passengerData = checkoutData.passengerData;
            return passengerData;
        }
    }
    return null;
}

export default function SelectSeatCard({
    header,
    departFrom,
    departFromFull, // TODO: Backend not yet implement
    arriveAt,
    arriveAtFull, // TODO: Backend not yet implement
    departTime,
    arriveTime,
    duration,
    date,
    passengerCount,
    passengerType,
    seatClass,
}: SelectSeatCardProps) {
    const { updatePassengerSeatAt } = useCheckout();
    const [selected, setSelected] = useState(false);
    const [selectedPassengers, setSelectedPassengers] = useState<number>(0);
    const passengerData: PassengerData[] = getPassengerData();
    const passengerSeatArr: string[] = useState<string[]>(
        passengerData.map((pass) => {
            if (header === "Departure") {
                return pass.seatSelection.departureSeat || "";
            } else if (header === "Return") {
                return pass.seatSelection.returnSeat || "";
            }
            return "";
        }),
    )[0];
    const [curSeat, setCurSeat] = useState("");

    function handlePassengerClick(index: number) {
        setSelectedPassengers((prev) => {
            if (prev === index) {
                setCurSeat("");
                return -1; // Deselect if already selected
            }
            setCurSeat(passengerSeatArr[index]);
            return index;
        });
    }

    function handleSeatClick(seat: string) {
        return () => {
            if (selectedPassengers === -1) {
                alert("Please select a passenger first.");
                return;
            }
            // Check if seat is already taken
            if (passengerSeatArr.includes(seat) && curSeat !== seat) {
                alert("Seat already taken. Please select another seat.");
                return;
            }
            // Assign seat to selected passenger
            passengerSeatArr[selectedPassengers] = seat;
            setCurSeat(seat);
        };
    }

    function randomeAvailableSeat(): string {
        console.log("random seat");
        const rows = 10;
        const cols = 6; // A-F
        let seat = "";
        while (true) {
            const row = Math.floor(Math.random() * rows) + 1;
            const col = String.fromCharCode(
                65 + Math.floor(Math.random() * cols),
            ); // 65 = 'A'
            seat = `${row}${col}`;
            if (!passengerSeatArr.includes(seat)) {
                break;
            }
        }
        return seat;
    }

    function handleConfirm() {
        for (let i = 0; i < passengerCount; i++) {
            const seatToAssign =
                passengerSeatArr[i] === ""
                    ? randomeAvailableSeat()
                    : passengerSeatArr[i];

            if (header === "Departure") {
                updatePassengerSeatAt(i, {
                    departureSeat: seatToAssign,
                });
            } else if (header === "Return") {
                updatePassengerSeatAt(i, {
                    returnSeat: seatToAssign,
                });
            }
        }

        // Show confirmation message
        alert(`${header} seats confirmed for all passengers!`);
        setSelected(false); // Close the seat map after confirmation
    }

    function PassengerName({
        index,
        onClick,
    }: {
        index: number;
        onClick: () => void;
    }) {
        return (
            <div
                className={`bg-primary-50 flex h-[3.1875rem] w-[15.3125rem] rounded-2xl ${selectedPassengers === index ? "ring-primary-400 ring-2" : ""}`}
                onClick={onClick}
            >
                <div className="flex w-full flex-row items-center justify-between gap-2 px-4 py-[0.3125rem]">
                    <div
                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg p-[0.4375rem] ${passengerSeatArr[index] ? "bg-primary-300" : "bg-disable-main"}`}
                    >
                        {/* TODO: implement passenger selection */}
                        <p className="!text-common-white !text-[0.875rem]">
                            {passengerSeatArr[index]
                                ? passengerSeatArr[index]
                                : "-"}
                        </p>
                    </div>
                    <div className="bg-primary-100 h-[2rem] w-[11.125rem] items-center rounded-lg p-[0.4375rem]">
                        <p className="!text-primary-400 !text-[0.875rem]">
                            {passengerData[index]?.givenName +
                                " " +
                                passengerData[index]?.lastName}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    function SeatMap() {
        return (
            <div className="flex h-[27.0625rem] w-full items-center justify-center bg-white px-6">
                <div className="flex h-[24rem] flex-col gap-4">
                    <div className="flex flex-row gap-5">
                        {/* Seat Map */}
                        <div className="g-8 bg-primary-50 flex w-[29.1875rem] flex-row items-center justify-center rounded-2xl p-8">
                            <div className="flex h-[14.125rem] w-[2rem] items-center justify-center rounded-lg bg-white">
                                <p className="!text-primary-600 -rotate-90 !text-[0.875rem]">
                                    Font
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 overflow-x-auto px-2 py-2">
                                {[...Array(6)].map((_, rowIndex) => {
                                    const letter = String.fromCharCode(
                                        70 - rowIndex,
                                    ); // 70 = 'F', then E, D, C, B, A
                                    const row = (
                                        <div
                                            key={letter}
                                            className="flex items-center gap-4"
                                        >
                                            {[...Array(10)].map(
                                                (_, colIndex) => (
                                                    // Seat
                                                    <div
                                                        key={colIndex}
                                                        className={`${curSeat === `${colIndex + 1}${letter}` ? "ring-primary-400 ring-2" : ""} min-h-8 min-w-8 p-[0.3125rem] ${passengerSeatArr.includes(`${colIndex + 1}${letter}`) && curSeat !== `${colIndex + 1}${letter}` ? "bg-gray-100" : "bg-white"} hover:bg-primary-100 flex cursor-pointer items-center justify-center rounded-lg`}
                                                        onClick={handleSeatClick(
                                                            `${colIndex + 1}${letter}`,
                                                        )}
                                                    >
                                                        <p className="!text-primary-600 -rotate-90 !text-[0.875rem]">
                                                            {colIndex + 1}
                                                            {letter}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    );

                                    // insert a small spacer (blank line) between D and C (after the first 3 rows: F,E,D)
                                    if (rowIndex === 3) {
                                        return [
                                            <div
                                                key="spacer"
                                                className="h-2"
                                            />,
                                            row,
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
                                <PassengerName
                                    key={index}
                                    index={index}
                                    onClick={() => handlePassengerClick(index)}
                                />
                            ))}
                        </div>
                    </div>
                    <Button
                        text="Confirm"
                        height="h-[2.0625rem]"
                        width="w-[45.875rem]"
                        onClick={handleConfirm}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary-50 flex h-fit w-fit rounded-lg p-6">
            {/* Content */}
            <div className="flex h-fit flex-col gap-4">
                <p className="!text-[2rem] !font-bold">{header}</p>
                {/* Box */}
                <div className="border-primary-300 flex h-fit w-[49.3125rem] flex-col rounded-sm border-2">
                    {/* Top part */}
                    <div className="bg-primary-300 flex px-4 py-2">
                        <p className="!text-[1.25rem] !font-semibold text-white">
                            {header}: {departFrom} to {arriveAt}
                        </p>
                    </div>
                    <div className="flex h-fit w-full flex-row">
                        {/* Left part */}
                        <div className="bg-primary-50 flex w-[36rem] flex-col gap-3 py-3">
                            <div className="flex items-center gap-3 px-4">
                                <FiSrPlane />
                                <p className="!text-primary-600 !text-[1.25rem] !font-semibold">
                                    Airline
                                </p>
                                <p className="!text-primary-600 !text-[1rem]">
                                    {date}
                                </p>
                            </div>
                            <div className="flex flex-row items-center px-8 pb-2">
                                <div className="flex w-[6.25rem] flex-col px-4 pb-2">
                                    <p className="!text-primary-600 !text-[1.5rem] !font-semibold">
                                        {departTime}
                                    </p>
                                    <p className="!text-primary-600 !text-[1rem]">
                                        {departFrom}
                                    </p>
                                    <p className="!text-primary-500 !text-[1rem]">
                                        {departFromFull}
                                    </p>
                                </div>
                                <div className="flex w-fit flex-col items-center gap-1 px-2 py-1">
                                    <p className="!text-primary-500 !text-[1rem]">
                                        {duration}
                                    </p>
                                    <FlightCardDivider />
                                </div>
                                <div className="flex w-fit flex-col px-4 pb-2">
                                    <p className="!text-primary-600 !text-[1.5rem] !font-semibold">
                                        {arriveTime}
                                    </p>
                                    <p className="!text-primary-600 !text-[1rem]">
                                        {arriveAt}
                                    </p>
                                    <p className="!text-primary-500 !text-[1rem]">
                                        {arriveAtFull}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Right part */}
                        <div className="bg-primary-100 flex h-auto w-[13.3125rem] flex-col items-center justify-center gap-3 px-4">
                            <div className="flex w-full flex-col items-end gap-1">
                                <p className="!text-primary-600 !text-[1rem]">
                                    {passengerCount} {passengerType}
                                </p>
                                <p className="!text-primary-600 !text-[1.125rem] !font-semibold">
                                    {seatClass}
                                </p>
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
                    {selected && <SeatMap />}
                </div>
            </div>
        </div>
    );
}
