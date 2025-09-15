import React, { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { SelectedValues } from "./search";

interface DateRangePickerProps {
    selectedStartDate: Date | null;
    selectedEndDate: Date | null;
    setSelectedStartDate: (date: Date | null) => void;
    setSelectedEndDate: (date: Date | null) => void;
    selectType: "One Way" | "Round Trip";
    onClose: () => void;
}

const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();
const isSameDay = (date1: Date, date2: Date) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
const isBetweenDates = (
    date: Date,
    startDate: Date | null,
    endDate: Date | null
) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
};

const DateRangePickerComponent: FC<DateRangePickerProps> = ({
    selectedStartDate,
    selectedEndDate,
    setSelectedStartDate,
    setSelectedEndDate,
    selectType,
    onClose,
}) => {
    const [currentMonth, setCurrentMonth] = useState(
        selectedStartDate || new Date()
    );
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(
            Date.UTC(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        );
        clickedDate.setUTCHours(0, 0, 0, 0);
        if (selectType === "One Way") {
            // Select only one date
            setSelectedStartDate(clickedDate);
            setSelectedEndDate(clickedDate);
            onClose(); 
        } else if (selectType === "Round Trip" && selectedStartDate) {
            // Ensure return date is not before depart date
            if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
                // Start a new range
                setSelectedStartDate(clickedDate);
                setSelectedEndDate(null); // Reset the end date
            } else if (selectedStartDate && !selectedEndDate) {
                // Set the end date of the range
                if (clickedDate >= selectedStartDate) {
                    setSelectedEndDate(clickedDate);
                    onClose(); // Close the picker after selecting the range
                }
            }
        }
    };

    const renderCalendar = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dates = [];
        for (let i = 0; i < firstDay; i++) {
            dates.push(<div key={`empty-${i}`} className="p-2"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const isSelectedStart =
                selectedStartDate && isSameDay(date, selectedStartDate);
            const isSelectedEnd =
                selectedEndDate && isSameDay(date, selectedEndDate);
            const isBetween = isBetweenDates(
                date,
                selectedStartDate,
                selectedEndDate
            );
            const isToday = isSameDay(date, today);

            let dayClass =
                "text-black w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200";

            if (isBetween) {
                // Apply gradient color to dates in the range if want
                // dayClass += " bg-gradient-to-r from-[#67C7D9] via-[#A7E3F3] to-[#67C7D9]"; // Gradient for range
            } else if (isSelectedStart) {
                dayClass += " bg-primary-600 text-white"; // Start date color
            } else if (isSelectedEnd) {
                dayClass += " bg-primary-600 text-white"; // End date color
            } else if (isToday) {
                dayClass += " border border-primary-600";
            } else {
                dayClass += " hover:bg-sky-100";
            }

            dates.push(
                <div
                    key={i}
                    onClick={() => handleDateClick(i)}
                    className={dayClass}
                >
                    {i}
                </div>
            );
        }
        return dates;
    };

    const handlePrevMonth = () =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    const handleNextMonth = () =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );

    const monthName = currentMonth.toLocaleString("default", {
        month: "long",
        year: "numeric",
    });

    return (
        <div
            ref={pickerRef}
            className="absolute top-full mt-2 w-80 bg-white border-2 border-primary-600 rounded-md shadow-lg z-10 p-4"
        >
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                >
                    <ChevronLeftIcon className="w-6 h-6 text-primary-900" />
                </button>
                <div className="font-semibold text-primary-900">
                    {monthName}
                </div>
                <button
                    onClick={handleNextMonth}
                    className="p-1 rounded-full hover:bg-gray-100"
                >
                    <ChevronRightIcon className="w-6 h-6 text-primary-900" />
                </button>
            </div>
            <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div key={`${day}-${index}`}>{day}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 text-center">
                {renderCalendar()}
            </div>
        </div>
    );
};

export default function DateRangePicker({
    isClicked,
    toggleDropDown,
    selectedStartDate, // Pass start date
    selectedEndDate, // Pass end date
    setSelectedStartDate, // Pass setter for start date
    setSelectedEndDate, // Pass setter for end date
    selectType, // Pass type of selection (depart or return)
}: {
    isClicked: boolean;
    toggleDropDown: () => void;
    selectedStartDate: Date | null; // Pass start date
    selectedEndDate: Date | null; // Pass end date
    setSelectedStartDate: (date: Date | null) => void; // Pass setter for start date
    setSelectedEndDate: (date: Date | null) => void; // Pass setter for end date
    selectType: "One Way" | "Round Trip"; // Pass type of selection (depart or return)
}) {
    const formatDate = (date: Date | null): string => {
        if (!date) return "";
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const getDateButtonText = () => {
        if (selectedStartDate && selectedEndDate) {
            if (selectedStartDate.getTime() === selectedEndDate.getTime()) {
                return `${formatDate(selectedStartDate)}`;
            }
            return `${formatDate(selectedStartDate)} - ${formatDate(
                selectedEndDate
            )}`;
        }
        return "Depart - Return";
    };

    return (
        <div className="relative flex flex-row w-full">
            <button
                className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-primary-900 border-primary-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary-400"
                onClick={toggleDropDown}
            >
                <div className="flex items-center">
                    <CalendarTodayIcon className="mr-2 text-primary-900" />
                    <span className="text-md text-primary-900">
                        {getDateButtonText()}
                    </span>
                </div>
                {!isClicked && <ArrowDropDownIcon className="mr-2" />}
                {isClicked && <ArrowDropUpIcon className="mr-2" />}
            </button>
            {isClicked && (
                <DateRangePickerComponent
                    selectedStartDate={selectedStartDate}
                    selectedEndDate={selectedEndDate}
                    setSelectedStartDate={setSelectedStartDate}
                    setSelectedEndDate={setSelectedEndDate}
                    selectType={selectType}
                    onClose={toggleDropDown} // Close picker after selecting date range
                />
            )}
        </div>
    );
}
