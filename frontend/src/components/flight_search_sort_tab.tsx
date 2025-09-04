"use client";
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PinDropIcon from '@mui/icons-material/PinDrop';
import { useState } from "react";

export default function Flight_Search_Sort_Tab() {
    const [selected, setSelected] = useState<string>("");

    const options = [
        {
            how: "price",
            label: "Price",
            detail: "Cheap - Expensive",
            icon: <LocalAtmIcon className="w-5 h-5" />,
        },
        {
            how: "duration",
            label: "Flight duration",
            detail: "Short - Long",
            icon: <WatchLaterIcon className="w-5 h-5" />,
        },
        {
            how: "stops",
            label: "No. of stops",
            detail: "Min - Max",
            icon: <PinDropIcon className="w-5 h-5" />,
        }
    ];

    return (
        <div className="bg-[#8BCEE1] p-4 rounded-sm w-75 space-y-3">
            <div className="text-3xl font-semibold text-[#025B79] mt-3 mb-4">Sort by</div>

            {options.map((option) => (
                <button
                key={option.how}
                onClick={() => setSelected(option.how)}
                className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-sm transition 
                    ${
                    selected === option.how
                        ? "bg-[#068CB7] text-white shadow"
                        : "bg-white hover:bg-sky-100 text-[#022b39]"
                    }`}
                >

                    <div className="flex-shrink-0">{option.icon}</div>
                    
                    <div>
                        <p className={`text-lg font-medium ${selected === option.how ? "text-white" : "text-[#022b39]"}`}>{option.label}</p>
                        <p className={`text-sm ${selected === option.how ? "text-white" : "text-[#848B8F]"}`}>
                        {option.detail}
                        </p>
                    </div>
                </button>
            ))}
        </div>
    );
}