'use client'
import { ArrowDropDown, ArrowDropUp, Person } from '@mui/icons-material';
import QuantitySelector from './QuantitySelector';
import { useState } from 'react';

interface PassengerProps {
  isClicked: boolean;
  toggleDropdown: () => void;
  passengerCount: {
    adult: number;
    children: number;
    infants: number;
  };
  handlePassengerCountChange: (type: string, value: number) => void;
}

export default function Passenger({
  isClicked,
  toggleDropdown,
  passengerCount,
  handlePassengerCountChange,
}: PassengerProps) {
  // State to track if the dropdown has been opened at least once
  const [hasDropdownBeenOpened, setHasDropdownBeenOpened] = useState(false);

  // Calculate total passengers: adults + children + infants
  const totalPassengers = passengerCount.adult + passengerCount.children + passengerCount.infants;

  // Handle the first dropdown click to change text permanently
  const handleDropdownClick = () => {
    if (!hasDropdownBeenOpened) {
      setHasDropdownBeenOpened(true);
    }
    toggleDropdown();
  };

  return (
    <div className="relative flex flex-row w-full">
      <button
        className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-primary-900 border-primary-600 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary-400"
        onClick={handleDropdownClick} // Use custom function to handle the state change
      >
        <div className="flex items-center">
          <Person className="mr-2" />
          <span>
            {hasDropdownBeenOpened ? `${totalPassengers} people` : "Passengers"}
          </span>
        </div>
        {isClicked ? <ArrowDropUp className="mr-2" /> : <ArrowDropDown className="mr-2" />}
      </button>
      {isClicked && (
        <div className="absolute top-full w-full bg-white text-primary-900 border border-gray-300 rounded shadow-lg z-10">
          <QuantitySelector
            label="Adult"
            description="12+ years old"
            count={passengerCount.adult}
            onChange={(value) => handlePassengerCountChange('adult', value)}
          />
          <QuantitySelector
            label="Children"
            description="2 - 11 years old"
            count={passengerCount.children}
            onChange={(value) => handlePassengerCountChange('children', value)}
          />
          <QuantitySelector
            label="Infants"
            description="Under 2 years old"
            count={passengerCount.infants}
            onChange={(value) => handlePassengerCountChange('infants', value)}
          />
        </div>
      )}
    </div>
  );
}
