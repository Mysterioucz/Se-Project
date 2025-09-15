"use client";
import {
    FlightTakeoff,
    FlightLand,
    ArrowDropDown,
    ArrowDropUp,
} from "@mui/icons-material";
import Passenger from "./Passenger";
import { MouseEventHandler, useState } from "react";
import DateRangePicker from "./DateRangePicker";
import { useEffect } from "react";
import { set } from "zod";

export type SelectedValues = {
    flight: "One Way" | "Round Trip";
    class: string;
    leave: string;
    go: string;
};

export type PassengerCount = {
    adult: number;
    children: number;
    infants: number;
};

export default function FlightSearchBar({
    headerText,
    selectedValues,
    setSelectedValues,
    passengerCount,
    setPassengerCount,
    selectedStartDate,
    selectedEndDate,
    setSelectedStartDate,
    setSelectedEndDate,

    onSearch, // The function to
}: {
    headerText: string;
    selectedValues: SelectedValues;
    setSelectedValues: (values: SelectedValues) => void;
    passengerCount: PassengerCount;
    setPassengerCount: (count: PassengerCount) => void;
    selectedStartDate: Date | null;
    selectedEndDate: Date | null;
    setSelectedStartDate: (date: Date | null) => void;
    setSelectedEndDate: (date: Date | null) => void;

    onSearch: MouseEventHandler<HTMLButtonElement>;
}) {
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

    // Helper function to toggle dropdown visibility and close others
    const toggleDropdown = (dropdown: string) => {
        setDropdownStates((prevState) => {
            const newState = { ...prevState };
            // Close all dropdowns except the one being toggled
            Object.keys(newState).forEach((key) => {
                if (key === dropdown) {
                    newState[key as keyof typeof newState] =
                        !newState[key as keyof typeof newState];
                } else {
                    newState[key as keyof typeof newState] = false;
                }
            });
            return newState;
        });
    };

    // Function to handle changes in passenger counts
    const handlePassengerCountChange = (type: string, value: number) => {
        setPassengerCount({
            ...passengerCount,
            [type as keyof PassengerCount]: value,
        });
    };

    // Function to handle selection of a value in any dropdown
    const handleSelection = (dropdown: keyof SelectedValues, value: string) => {
        if (dropdown === "flight" && value !== selectedValues.flight) {
            setSelectedStartDate(null); // Clear start date when flight type changes
            setSelectedEndDate(null); // Clear return date for one way flights
        }
        setSelectedValues({
            ...selectedValues,
            [dropdown]: value,
        });
        toggleDropdown(dropdown); // Close the dropdown after selection
    };

    const [cities, setCities] = useState<string[]>([]);
    useEffect(() => {
        async function fetchCities() {
            try {
                const response = await fetch("/api/v1/city");
                if (!response.ok) {
                    throw new Error("Failed to fetch cities");
                }
                const data = await response.json();
                setCities(data.data.map((city: { City: string }) => city.City)); // Extract city names
            } catch (err) {
                console.log("Failed to fetch cities");
            }
        }

        fetchCities();
    }, []);

    return (
        <div className="w-full mx-auto text-nowrap">
            {/* Header Text */}
            <div className="bg-primary-400 text-white p-4 rounded-t-sm mt-4">
                <div className="text-3xl font-medium mx-3">{headerText}</div>
            </div>

            <div className="bg-white p-4 rounded-b-lg border-x-5 border-b-5 border-primary-400">
                {/* Flight type and Class type */}
                <div className="flex flex-wrap items-center gap-10 mb-2 ml-5 text-lg text-primary-900 font-medium">
                    {/* Flight Type */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown("flight")}>
                            <span>{selectedValues.flight}</span>
                            {dropdownStates.flight ? (
                                <ArrowDropUp />
                            ) : (
                                <ArrowDropDown />
                            )}
                        </button>
                        {dropdownStates.flight && (
                            <ul className="absolute mt-2 w-40 bg-white text-primary-900 border border-gray-300 rounded shadow-lg z-10">
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleSelection("flight", "Round Trip")
                                    }
                                >
                                    <p>Round trip</p>
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleSelection("flight", "One Way")
                                    }
                                >
                                    <p>One way</p>
                                </li>
                            </ul>
                        )}
                    </div>

                    {/* Class Type */}
                    <div className="relative">
                        <button onClick={() => toggleDropdown("class")}>
                            <span>{selectedValues.class}</span>
                            {dropdownStates.class ? (
                                <ArrowDropUp />
                            ) : (
                                <ArrowDropDown />
                            )}
                        </button>
                        {dropdownStates.class && (
                            <ul className="absolute mt-2 w-40 bg-white text-primary-900 border border-gray-300 rounded shadow-lg z-10">
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleSelection("class", "Economy")
                                    }
                                >
                                    <p>Economy</p>
                                </li>
                                <li
                                    className="px-4 py-2 w-fit hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleSelection(
                                            "class",
                                            "Premium Economy"
                                        )
                                    }
                                >
                                    <p>Premium Economy</p>
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleSelection("class", "Business")
                                    }
                                >
                                    <p>Business</p>
                                </li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                        handleSelection("class", "First")
                                    }
                                >
                                    <p>First</p>
                                </li>
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
                            onClick={() => toggleDropdown("leave")}
                        >
                            <div className="flex items-center">
                                <FlightTakeoff className="mr-2" />
                                <span>{selectedValues.leave}</span>
                            </div>
                            {dropdownStates.leave ? (
                                <ArrowDropUp className="mr-2" />
                            ) : (
                                <ArrowDropDown className="mr-2" />
                            )}
                        </button>
                        {dropdownStates.leave && (
                            <ul className="absolute top-full max-h-50 w-full bg-white text-primary-900 border border-gray-300 rounded shadow-lg z-10 overflow-y-scroll">
                                {cities.map((city, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleSelection("leave", city)
                                        }
                                    >
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Going to ? */}
                    <div className="relative flex flex-row w-full">
                        <button
                            className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-primary-900 border-primary-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary-400"
                            onClick={() => toggleDropdown("go")}
                        >
                            <div className="flex items-center">
                                <FlightLand className="mr-2" />
                                <span>{selectedValues.go}</span>
                            </div>
                            {dropdownStates.go ? (
                                <ArrowDropUp className="mr-2" />
                            ) : (
                                <ArrowDropDown className="mr-2" />
                            )}
                        </button>
                        {dropdownStates.go && (
                            <ul className="absolute top-full max-h-50 w-full bg-white text-primary-900 border border-gray-300 rounded shadow-lg z-10 overflow-y-scroll">
                                {cities.map((city, index) => (
                                    <li
                                        key={index}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() =>
                                            handleSelection("go", city)
                                        }
                                    >
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Depart - Return (DatePicker) */}
                    <div className="relative flex flex-row w-full">
                        <DateRangePicker
                            isClicked={dropdownStates.datepicker}
                            toggleDropDown={() => toggleDropdown("datepicker")}
                            selectedStartDate={selectedStartDate} // Pass start date
                            selectedEndDate={selectedEndDate} // Pass end date
                            setSelectedStartDate={setSelectedStartDate} // Pass setter for start date
                            setSelectedEndDate={setSelectedEndDate} // Pass setter for end date
                            selectType={selectedValues.flight} // Pass type of selection (depart or return)
                        />
                    </div>

                    {/* Passengers (Passenger) */}
                    <div className="relative flex flex-row w-full">
                        <Passenger
                            isClicked={dropdownStates.passengers}
                            toggleDropdown={() => toggleDropdown("passengers")}
                            handlePassengerCountChange={
                                handlePassengerCountChange
                            } // Pass the function to update passenger count
                            passengerCount={passengerCount} // Pass current counts to be displayed in QuantitySelector
                        />
                    </div>

                    {/* Search */}
                    <button
                        type="button"
                        className="relative flex items-center text-white text-lg bg-primary-400 rounded-sm py-2 border-2 border-primary-400 pl-10 pr-10 --font-sans hover:bg-primary-600"
                        onClick={onSearch}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
