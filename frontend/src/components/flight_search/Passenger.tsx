import { ArrowDropDown, ArrowDropUp, Person } from '@mui/icons-material';
import QuantitySelector from './QuantitySelector';

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
  return (
    <div className="relative flex flex-row w-full">
      <button
        className="relative flex items-center justify-between w-full pl-3 py-2 border-2 text-[#022b39] border-[#067399] rounded-sm focus:outline-none focus:ring-1 focus:ring-[#30A2C5]"
        onClick={toggleDropdown}
      >
        <div className="flex items-center">
          <Person className="mr-2" />
          <span>Passengers</span>
        </div>
        {isClicked ? <ArrowDropUp className="mr-2" /> : <ArrowDropDown className="mr-2" />}
      </button>
      {isClicked && (
        <div className="absolute top-full w-full bg-white text-[#022b39] border border-gray-300 rounded shadow-lg z-10">
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
