import React, { useState, useEffect, useRef } from 'react';
import type { FC } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface DatePickerProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  onClose: () => void;
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
const isSameDay = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

// --- THE DATE PICKER CALENDAR COMPONENT ---
export const DatePickerComponent: FC<DatePickerProps> = ({ selectedDate, setSelectedDate, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);


  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    clickedDate.setHours(0, 0, 0, 0);
    setSelectedDate(clickedDate);
    onClose(); // Close picker after selection
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();
    today.setHours(0,0,0,0);

    const dates = [];
    for (let i = 0; i < firstDay; i++) {
      dates.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isToday = isSameDay(date, today);

      let dayClass = "text-black w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors duration-200";
      
    //   if (date < today) {
        // dayClass += " cursor-not-allowed";
    //   } else {
        dayClass += " hover:bg-sky-100";
    //   }

      if (isSelected) {
        dayClass += " bg-[#067399] text-white";
      } else if (isToday) {
        dayClass += " border border-[#067399]";
      }
      
      dates.push(
        // <div key={i} onClick={() => date >= today && handleDateClick(i)} className={dayClass}>
        <div key={i} onClick={() => handleDateClick(i)} className={dayClass}>
           {i}
       </div>
      );
    }
    return dates;
  };
  
  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div ref={pickerRef} className="absolute top-full mt-2 w-80 bg-white border-2 border-[#067399] rounded-md shadow-lg z-10 p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronLeftIcon className="w-6 h-6 text-[#022b39]" />
        </button>
        <div className="font-semibold text-[#022b39]">{monthName}</div>
        <button onClick={handleNextMonth} className="p-1 rounded-full hover:bg-gray-100">
          <ChevronRightIcon className="w-6 h-6 text-[#022b39]" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 text-center">
        {renderCalendar()}
      </div>
    </div>
  );
};


export default function Date_Picker() {
  // State for the date picker dropdown visibility
  const [isDepartReturnClicked, setDepartReturnClicked] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Helper function to toggle dropdown visibility and close others
  const toggleDropdown = () => {
    setDepartReturnClicked(prevState => !prevState);  // Toggle visibility
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getDateButtonText = () => {
    if (selectedDate) {
      return formatDate(selectedDate);
    }
    return 'Depart - Return';
  };

  return (
    <div className='relative flex flex-row w-full'>
      <button 
        className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-[#022b39] border-[#067399] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#30A2C5]"
        onClick={toggleDropdown}  // Use toggleDropdown to show/hide the calendar
      >
        <div className="flex items-center">
          <CalendarTodayIcon className="mr-2 text-primary-900" />
          <span className="text-md text-primary-900">{getDateButtonText()}</span>
        </div>
        { !isDepartReturnClicked && (<ArrowDropDownIcon className='mr-2' />) }
        { isDepartReturnClicked && (<ArrowDropUpIcon className='mr-2' />) }
      </button>
      {isDepartReturnClicked && (
        <DatePickerComponent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onClose={() => setDepartReturnClicked(false)}  // Close the picker after a date is selected
        />
      )}
    </div>
  );
}

