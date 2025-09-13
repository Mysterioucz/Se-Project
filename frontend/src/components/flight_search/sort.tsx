"use client";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import PinDropIcon from "@mui/icons-material/PinDrop";
import { useState } from "react";

export default function FlightSortTab(
    { sort, setSort } : { sort: string, setSort: Function }
) {

    const options = [
        {
            how: "price",
            label: "Price",
            detail: "Cheap - Expensive",
            icon: <LocalAtmIcon className="w-9 h-9" />,
        },
        {
            how: "duration",
            label: "Flight duration",
            detail: "Short - Long",
            icon: <WatchLaterIcon className="w-9 h-9" />,
        },
        {
            how: "stops",
            label: "No. of stops",
            detail: "Min - Max",
            icon: <PinDropIcon className="w-9 h-9" />,
        },
    ];

    const handleOptionClick = (how: string) => {
        // Toggle the selected option: if it's already selected, unselect it; otherwise, select it
        setSort((prevSelected: string) => (prevSelected === how ? "" : how));
    };

    return (
        <div className="flex flex-col bg-primary-200 p-3 rounded-lg w-75 h-fit gap-2">
            <h1 className="text-4xl font-semibold text-primary-700 px-1 py-2">
                Sort by
            </h1>

            {options.map((option) => (
                <button
                    key={option.how}
                    onClick={() => handleOptionClick(option.how)} // Toggle selection on click
                    className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition 
                        ${
                            sort === option.how
                                ? "bg-primary-500 text-white shadow"
                                : "bg-white hover:bg-sky-100 text-primary-900"
                        }`}
                >
                    <div className="flex-shrink-0">{option.icon}</div>

                    <div>
                        <p
                            className={`text-xl font-medium ${
                                sort === option.how
                                    ? "text-white"
                                    : "text-primary-900"
                            }`}
                        >
                            {option.label}
                        </p>
                        <p
                            className={`text-md font-medium ${
                                sort === option.how
                                    ? "text-white"
                                    : "text-gray-300"
                            }`}
                        >
                            {option.detail}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}
