'use client'
import CheckIcon from '@mui/icons-material/Check';
import TimeSlider from '../TimeSlider';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

export default function FlightFilterTab(
    {
        selectedAirlines,
        setSelectedAirlines,
        departureTime,
        setDepartureTime,
        arrivalTime,
        setArrivalTime,
        handleApply
    } : {
        selectedAirlines: string[]
        setSelectedAirlines: Function
        departureTime: number[]
        setDepartureTime: Dispatch<SetStateAction<number[]>>
        arrivalTime: number[]
        setArrivalTime: Dispatch<SetStateAction<number[]>>,
        handleApply: Function
    }
) {
    const handleReset = () => {
        setSelectedAirlines([]);
        setDepartureTime([0, 24]);
        setArrivalTime([0, 24]);
    };

    const handleCheckboxChange = (name: string): void => {
        setSelectedAirlines((prevSelectedAirlines: string[]) =>
            prevSelectedAirlines.includes(name)
                ? prevSelectedAirlines.filter((airlineName) => airlineName !== name)
                : [...prevSelectedAirlines, name]
        );
    };
    
    // Get airlines from database
    const [airlines, setAirlines] = useState<string[]>([]);
    useEffect(() => {
        async function fetchAirlines() {
            try {
                const response = await fetch('/api/v1/airlines');
                if (!response.ok) {
                    throw new Error('Failed to fetch cities');
                }
                const data = await response.json();
                setAirlines(data.data.map((airline: { AirlineName: string }) => airline.AirlineName));  // Extract city names
            } catch (err) {
                console.log('Failed to fetch cities');
            }
        }

        fetchAirlines();
    }, []);

    return (
    <div className="flex flex-col bg-primary-200 rounded-lg w-90 p-3 h-fit gap-2">

        {/* Filter by */}
        <div className="text-primary-700 text-3xl font-bold py-2 px-1">
            Filter by
        </div>

        {/* Airlines */}
        <div className="bg-white rounded-lg px-3 py-4">
            <div className="text-primary-900 text-2xl font-bold mx-3 mt-4">Airlines</div>
            <div className="mx-3">
                <ul className="space-y-4 max-h-[200] overflow-y-auto pr-2 mb-4 mt-3">

                    {airlines.map((airline, index) => (
                    <li key={index}>
                        <label className="flex items-center space-x-3 cursor-pointer text-primary-900 text-base">
                        <input
                            type="checkbox"
                            className="hidden peer"
                            checked={selectedAirlines.includes(airline)}
                            onChange={() => handleCheckboxChange(airline)}
                        />

                        <span className="w-6 h-6 border-2 border-dashed border-primary-200 rounded-md flex items-center justify-center transition-all duration-200 peer-checked:bg-primary-200 peer-checked:border-[#a0dde6] peer-checked:border-solid relative">
                            <CheckIcon className="hidden w-4 h-4 text-white peer-checked:block" />
                        </span>

                        <span className="text-md font-medium">{airline}</span>
                        </label>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        
        {/* Depature Time */}
        <div className="bg-white rounded-sm px-3 py-4">
            <TimeSlider label="Departure Time" value={departureTime} setValue={setDepartureTime} />
        </div>
        
        {/* Arrival Time */}
        <div className="bg-white rounded-sm px-3 py-4">
            <TimeSlider label="Arrival Time" value={arrivalTime} setValue={setArrivalTime} />
        </div>
        
        {/* Bottom Button */}
        <div className="flex flex-row justify-between rounded-sm gap-2">
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