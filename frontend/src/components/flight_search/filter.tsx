'use client'
import CheckIcon from '@mui/icons-material/Check';
import TimeSlider from '../TimeSlider';
import { useState } from 'react';

export default function FlightFilterTab() {
    const [selectedAirlines, setSelectedAirlines] = useState<number[]>([]);
    const [departureTime, setDepartureTime] = useState([0, 24]);
    const [arrivalTime, setArrivalTime] = useState([0, 24]);

    const handleReset = () => {
        setSelectedAirlines([]);
        setDepartureTime([0, 24]);
        setArrivalTime([0, 24]);
    };
    
    const handleApply = () => {
        // const filters = {
        //     airlines: selectedAirlines,
        //     departure: departureTime,
        //     arrival: arrivalTime
        // };
        // console.log("Applying Filters:", filters);
        // Fetch Data
        // alert(`Filters Applied!\n\n${JSON.stringify(filters, null, 2)}`);
    };

    const handleCheckboxChange = (id: number): void => {
        setSelectedAirlines((prevSelectedAirlines) =>
            prevSelectedAirlines.includes(id)
                ? prevSelectedAirlines.filter((airlineId) => airlineId !== id)
                : [...prevSelectedAirlines, id]
        );
    };

    const mockAirlines = [
        { id: 1, name: "Airline A" },
        { id: 2, name: "Airline B" },
        { id: 3, name: "Airline C" },
        { id: 4, name: "Airline D" },
        { id: 5, name: "Airline E" },
        { id: 6, name: "Airline F" },
        { id: 7, name: "Airline G" },
        { id: 8, name: "Airline H" },
    ];

    return (
    <div className="flex flex-col bg-primary-200 rounded-lg w-90 px-2">

        {/* Filter by */}
        <div className="text-primary-700 text-3xl font-bold py-3 ml-2 mt-3">
            Filter by
        </div>

        {/* Airlines */}
        <div className="bg-white rounded-lg m-2 px-2">
            <div className="text-primary-900 text-2xl font-bold mx-3 mt-4">Airlines</div>
            <div className="mx-3">
                <ul className="space-y-4 max-h-[200] overflow-y-auto pr-2 mb-4 mt-3">

                    {mockAirlines.map((airline) => (
                    <li key={airline.id}>
                        <label className="flex items-center space-x-3 cursor-pointer text-primary-900 text-base">
                        <input
                            type="checkbox"
                            className="hidden peer"
                            checked={selectedAirlines.includes(airline.id)}
                            onChange={() => handleCheckboxChange(airline.id)}
                        />

                        <span className="w-6 h-6 border-2 border-dashed border-primary-200 rounded-md flex items-center justify-center transition-all duration-200 peer-checked:bg-primary-200 peer-checked:border-[#a0dde6] peer-checked:border-solid relative">
                        <CheckIcon className="hidden w-4 h-4 text-white peer-checked:block" />
                        </span>

                        <span className='text-md font-medium'>{airline.name}</span>
                        </label>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        
        {/* Depature Time */}
        <div className="bg-white rounded-sm m-2">
            <TimeSlider label="Departure Time" value={departureTime} setValue={setDepartureTime} />
        </div>
        
        {/* Arrival Time */}
        <div className="bg-white rounded-sm m-2">
            <TimeSlider label="Arrival Time" value={arrivalTime} setValue={setArrivalTime} />
        </div>
        
        {/* Bottom Button */}
        <div className="flex flex-row m-2 justify-centerl rounded-sm gap-2">
            <button className="bg-white text-primary-400 w-full py-2 rounded-sm border-1 border-primary-500 cursor-pointer" onClick={() => handleReset()}>
                Reset
            </button>

            <button className="bg-primary-500 text-white w-full py-2 rounded-sm cursor-pointer" onClick={() => handleApply()}>
                Apply filter
            </button>
        </div>
    </div>
    );
}