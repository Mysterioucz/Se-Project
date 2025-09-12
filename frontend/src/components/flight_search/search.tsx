'use client';
import { FlightTakeoff, FlightLand, ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import Passenger from './Passenger';
import { useState } from 'react';
import DatePicker from './DatePicker';
import DateRangePicker from './DateRangePicker';

export default function FlightSearchBar({ headerText }: { headerText: string }) {
    // Consolidated state for dropdown visibility
    const [dropdownStates, setDropdownStates] = useState({
        flight: false,
        class: false,
        leave: false,
        go: false,
        departReturn: false,
        passengers: false,
        datepicker: false, // Added state for the DatePicker toggle
    });

    // Track selected values for each dropdown
    const [selectedValues, setSelectedValues] = useState({
        flight: 'Round trip',  // default value for flight type
        class: 'Economy',      // default value for class type
        leave: 'Leaving From?',  // default value for leaving from
        go: 'Going to?',   // default value for going to
    });

    // Track passenger counts
    const [passengerCount, setPassengerCount] = useState({
        adult: 1,
        children: 0,
        infants: 0,
    });

    // Helper function to toggle dropdown visibility and close others
    const toggleDropdown = (dropdown: string) => {
        setDropdownStates(prevState => {
            const newState = { ...prevState };
            // Close all dropdowns except the one being toggled
            Object.keys(newState).forEach(key => {
                if (key === dropdown) {
                    newState[key as keyof typeof newState] = !newState[key as keyof typeof newState];
                } else {
                    newState[key as keyof typeof newState] = false;
                }
            });
            return newState;
        });
    };

    // Function to handle changes in passenger counts
    const handlePassengerCountChange = (type: string, value: number) => {
        setPassengerCount(prevState => ({
            ...prevState,
            [type]: value,
        }));
    };

    // Function to handle selection of a value in any dropdown
    const handleSelection = (dropdown: string, value: string) => {
        setSelectedValues(prevState => ({
            ...prevState,
            [dropdown]: value,
        }));
        toggleDropdown(dropdown);  // Close the dropdown after selection
    };

    return (
        <div className="w-full mx-auto --font-sans">
            {/* Header Text */}
            <div className="bg-primary-400 text-white p-4 rounded-t-sm mt-4">
                <div className="text-3xl font-semibold">{headerText}</div>
            </div>

            <div className="bg-white p-4 rounded-b-lg border-x-5 border-b-5 border-primary-400">
                {/* Flight type and Class type */}
                <div className="flex flex-wrap items-center gap-10 mb-2 ml-5 text-lg text-primary-900 font-medium">
                    {/* Flight Type */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('flight')}
                        >
                            <span>{selectedValues.flight}</span>
                            {dropdownStates.flight ? <ArrowDropUp /> : <ArrowDropDown />}
                        </button>
                        {dropdownStates.flight && (
                            <ul className="absolute mt-2 w-40 bg-white text-primary-900 border border-gray-300 rounded shadow-lg z-10">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelection('flight', 'Round trip')}>Round trip</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelection('flight', 'One way')}>One way</li>
                            </ul>
                        )}
                    </div>

                    {/* Class Type */}
                    <div className="relative">
                        <button
                            onClick={() => toggleDropdown('class')}
                        >
                            <span>{selectedValues.class}</span>
                            {dropdownStates.class ? <ArrowDropUp /> : <ArrowDropDown />}
                        </button>
                        {dropdownStates.class && (
                            <ul className="absolute mt-2 w-40 bg-white text-primary-900 border border-gray-300 rounded shadow-lg z-10">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelection('class', 'Economy')}>Economy</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelection('class', 'Premium Economy')}>Premium Economy</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelection('class', 'Business')}>Business</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelection('class', 'First')}>First</li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* 4 inputs */}
                <div className="flex flex-row gap-2 mt-3 text-lg">
                    {/* Leaving From ? */}
                    <div className="relative flex flex-row w-full">
                        <button
                            className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-primary-900 border-primary-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary-400"
                            onClick={() => toggleDropdown('leave')}
                        >
                            <div className="flex items-center">
                                <FlightTakeoff className="mr-2" />
                                <span>{selectedValues.leave}</span>
                            </div>
                            {dropdownStates.leave ? <ArrowDropUp className="mr-2" /> : <ArrowDropDown className="mr-2" />}
                        </button>
                        {dropdownStates.leave && (
                            <ul className="absolute top-full max-h-50 w-full bg-white text-primary-900 border border-gray-300 rounded shadow-lg z-10 overflow-y-scroll">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelection('leave', 'Bangkok')}>Bangkok</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelection('leave', 'Chiang Mai')}>Chiang Mai</li>
                                {/* Add other list items here */}
                            </ul>
                        )}
                    </div>

                    {/* Going to ? */}
                    <div className="relative flex flex-row w-full">
                        <button
                            className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-primary-900 border-primary-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary-400"
                            onClick={() => toggleDropdown('go')}
                        >
                            <div className="flex items-center">
                                <FlightLand className="mr-2" />
                                <span>{selectedValues.go}</span>
                            </div>
                            {dropdownStates.go ? <ArrowDropUp className="mr-2" /> : <ArrowDropDown className="mr-2" />}
                        </button>
                        {dropdownStates.go && (
                            <ul className="absolute top-full max-h-50 w-full bg-white text-primary-900 border border-gray-300 rounded shadow-lg z-10 overflow-y-scroll">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelection('go', 'Paris')}>Paris</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleSelection('go', 'New York')}>New York</li>
                                {/* Add other list items here */}
                            </ul>
                        )}
                    </div>

                    {/* Depart - Return (DatePicker) */}
                    <div className="relative flex flex-row w-full">
                        <DateRangePicker
                            isClicked={dropdownStates.datepicker}
                            toggleDropDown={() => toggleDropdown('datepicker')}
                        />
                    </div>

                    {/* Passengers (Passenger) */}
                    <div className="relative flex flex-row w-full">
                        <Passenger
                            isClicked={dropdownStates.passengers}
                            toggleDropdown={() => toggleDropdown('passengers')}
                            handlePassengerCountChange={handlePassengerCountChange}  // Pass the function to update passenger count
                            passengerCount={passengerCount}  // Pass current counts to be displayed in QuantitySelector
                        />
                    </div>

                    {/* Search */}
                    <button
                        className="relative flex items-center text-white text-lg bg-primary-400 rounded-sm py-2 border-2 border-primary-400 pl-10 pr-10 --font-sans hover:bg-primary-600"
                        onClick={() => {
                            // TODO Fetch Data
                        }}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
