"use client";
import CheckIcon from "@mui/icons-material/Check";
import TimeSlider from "@src/components/TimeSlider";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function FlightFilterTab({
    selectedAirlines,
    setSelectedAirlines,
    departureTime,
    setDepartureTime,
    arrivalTime,
    setArrivalTime,
    handleApply,
}: {
    selectedAirlines: string[];
    setSelectedAirlines: Dispatch<SetStateAction<string[]>>;
    departureTime: number[];
    setDepartureTime: Dispatch<SetStateAction<number[]>>;
    arrivalTime: number[];
    setArrivalTime: Dispatch<SetStateAction<number[]>>;
    handleApply: () => void;
}) {
    const handleReset = () => {
        setSelectedAirlines([]);
        setDepartureTime([0, 24]);
        setArrivalTime([0, 24]);
    };

    const handleCheckboxChange = (name: string): void => {
        setSelectedAirlines((prevSelectedAirlines: string[]) =>
            prevSelectedAirlines.includes(name)
                ? prevSelectedAirlines.filter(
                      (airlineName) => airlineName !== name,
                  )
                : [...prevSelectedAirlines, name],
        );
    };

    // Get airlines from database
    const [airlines, setAirlines] = useState<string[]>([]);
    useEffect(() => {
        async function fetchAirlines() {
            try {
                const response = await fetch("/api/v1/airlines");
                if (!response.ok) {
                    throw new Error("Failed to fetch cities");
                }
                const data = await response.json();
                setAirlines(
                    data.data.map(
                        (airline: { AirlineName: string }) =>
                            airline.AirlineName,
                    ),
                ); // Extract city names
            } catch (err) {
                console.log("Failed to fetch cities");
            }
        }

        fetchAirlines();
    }, []);

    return (
        <div className="bg-primary-200 flex h-fit w-full max-w-[18.75rem] flex-col gap-2 rounded-lg p-3">
            {/* Filter by */}
            <div className="text-primary-700 px-1 py-2 text-3xl font-bold">
                Filter by
            </div>

            {/* Airlines */}
            <div className="rounded-lg bg-white px-3 py-4">
                <div className="text-primary-900 mx-3 mt-4 text-2xl font-bold">
                    Airlines
                </div>
                <div className="mx-3">
                    <ul className="mt-3 mb-4 max-h-[200] space-y-4 overflow-y-auto pr-2">
                        {airlines.map((airline, index) => (
                            <li key={index}>
                                <label className="text-primary-900 flex cursor-pointer items-center space-x-3 text-base">
                                    <input
                                        type="checkbox"
                                        className="peer hidden"
                                        checked={selectedAirlines.includes(
                                            airline,
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(airline)
                                        }
                                    />

                                    <span className="border-primary-200 peer-checked:bg-primary-200 relative flex h-6 w-6 items-center justify-center rounded-md border-2 border-dashed transition-all duration-200 peer-checked:border-solid peer-checked:border-[#a0dde6]">
                                        <CheckIcon className="hidden h-4 w-4 text-white peer-checked:block" />
                                    </span>

                                    <span className="text-md font-medium">
                                        {airline}
                                    </span>
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Depature Time */}
            <div className="rounded-sm bg-white px-3 py-4">
                <TimeSlider
                    label="Departure Time"
                    value={departureTime}
                    setValue={setDepartureTime}
                />
            </div>

            {/* Arrival Time */}
            <div className="rounded-sm bg-white px-3 py-4">
                <TimeSlider
                    label="Arrival Time"
                    value={arrivalTime}
                    setValue={setArrivalTime}
                />
            </div>

            {/* Bottom Button */}
            <div className="flex flex-row justify-between gap-2 rounded-sm">
                <button
                    className="text-primary-400 border-primary-500 w-full cursor-pointer rounded-sm border-1 bg-white py-2"
                    onClick={() => handleReset()}
                >
                    Reset
                </button>

                <button
                    className="bg-primary-500 w-full cursor-pointer rounded-sm py-2 text-white"
                    onClick={() => handleApply()}
                >
                    Apply filter
                </button>
            </div>
        </div>
    );
}
