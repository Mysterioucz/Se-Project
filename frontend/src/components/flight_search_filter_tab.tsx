'use client'
import CheckIcon from '@mui/icons-material/Check';
import TimeSlider from './time_slider';

export default function Flight_Search_Filter_Tab() {

    const handleReset = () => {
        // setSelectedAirlines([]);
        // setDepartureTime({ min: TIME_MIN, max: TIME_MAX });
        // setArrivalTime({ min: TIME_MIN, max: TIME_MAX });
        // // Change keys to force sliders to re-mount with initial values
        // setDepartureKey(prev => prev + 1);
        // setArrivalKey(prev => prev + 1);
    };
    
    const handleApply = () => {
        // const filters = {
        //     airlines: selectedAirlines,
        //     departure: departureTime,
        //     arrival: arrivalTime
        // };
        // console.log("Applying Filters:", filters);
        // // In a real app, you would use these values to filter flight data.
        // alert(`Filters Applied!\n\n${JSON.stringify(filters, null, 2)}`);
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
    <div className="flex flex-col bg-[#8BCEE1] rounded-sm w-90">
        {/* Filter by */}
        <div className="text-[#025B79] text-2xl font-bold py-3 ml-2">
            Filter by
        </div>

        {/* Airlines */}
        <div className="bg-white rounded-sm m-2">
            <div className="text-[#022b39] text-xl font-bold mx-3 mt-3 mb-2">Airlines</div>
            <div className="mx-3">
                <ul className="space-y-4 max-h-[200] overflow-y-auto pr-2">
                    {mockAirlines.map((airline) => (
                    <li key={airline.id}>
                        <label className="flex items-center space-x-3 cursor-pointer text-[#022b39] text-base">
                        <input type="checkbox" className="hidden peer" />

                        <span className="w-6 h-6 border-2 border-dashed border-[#8BCEE1] rounded-md flex items-center justify-center transition-all duration-200 peer-checked:bg-[#8BCEE1] peer-checked:border-[#a0dde6] peer-checked:border-solid relative">
                        <CheckIcon className="hidden w-4 h-4 text-white peer-checked:block" />
                        </span>

                        <span>{airline.name}</span>
                        </label>
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        
        {/* Depature Time */}
        <div className="bg-white rounded-sm m-2">
            <TimeSlider label="Departure Time"/>
        </div>
        
        {/* Arrival Time */}
        <div className="bg-white rounded-sm m-2">
            <TimeSlider label="Arrival Time"/>
        </div>
        
        {/* Bottom Button */}
        <div className="flex flex-row m-2 justify-centerl rounded-sm gap-2">
            <button className="bg-white text-[#30A2C5] w-full py-2 rounded-sm border-1 border-[#068CB7]" onClick={() => handleReset()}>
                Reset
            </button>

            <button className="bg-[#068CB7] text-white w-full py-2 rounded-sm" onClick={() => handleApply()}>
                Apply filter
            </button>
        </div>
    </div>
    );
}