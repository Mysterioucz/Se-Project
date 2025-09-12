"use client";
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { useState } from "react";

export default function FlightSortTab() {
    const [selected, setSelected] = useState<string>("");

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
        }
    ];

    const handleOptionClick = (how: string) => {
        // Toggle the selected option: if it's already selected, unselect it; otherwise, select it
        setSelected(prevSelected => prevSelected === how ? "" : how);
    };

    return (
        <div className="bg-primary-200 p-4 rounded-lg w-75 space-y-3">
            <div className="text-4xl font-semibold text-primary-700 mt-3 mb-6">Sort by</div>

            {options.map((option) => (
                <button
                    key={option.how}
                    onClick={() => handleOptionClick(option.how)} // Toggle selection on click
                    className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition 
                        ${selected === option.how
                            ? "bg-primary-500 text-white shadow"
                            : "bg-white hover:bg-sky-100 text-primary-900"
                        }`}
                >
                    <div className="flex-shrink-0">{option.icon}</div>
                    
                    <div>
                        <p className={`text-xl font-medium font-medium ${selected === option.how ? "text-white" : "text-primary-900"}`}>{option.label}</p>
                        <p className={`text-md font-medium ${selected === option.how ? "text-white" : "text-gray-300"}`}>
                        {option.detail}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}
