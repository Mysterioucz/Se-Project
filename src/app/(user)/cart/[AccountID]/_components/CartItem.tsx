import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { CartType } from '../../../../../enums/CartType';
import FlightDetail from './FlightDetail';

export default function CartItem({ item, isSelected, onSelect, onRemove } : { 
    item: CartType, 
    isSelected:boolean, 
    onSelect: (id:number) => void, 
    onRemove: (id:number) => void 
}) {

    return (
        <div className="border-3 border-primary-300 rounded-lg mb-6 overflow-hidden">
            <div className="bg-primary-300 p-2 flex items-center justify-between">
                <div className="flex items-center">
                <input
                    type="checkbox"
                    className="h-5 w-5 rounded mx-2 accent-white bg-primary-300 text-primary focus:white cursor-pointer"
                    checked={isSelected}
                    onChange={() => onSelect(item.id)}
                />
                <div className="ml-2 font-bold text-xl text-white">
                    {item.FlightType === 'One-way' ? 'One-way' : 'Round-Trip'}: {item.DepartureAirport} to {item.ArrivalAirport}
                </div>
                </div>
                <button onClick={() => onRemove(item.id)} className="flex items-center text-lg text-red-600 hover:text-red-800 transition-colors mx-1">
                <DeleteOutline className="w-6 h-6 mr-1" />
                Remove
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
                <div className="md:col-span-2">
                <FlightDetail headerText="Depart" departAirport={item.DepartureAirport} arrivalAirport={item.ArrivalAirport} departCity={item.DepartureCity} arrivalCity={item.ArrivalCity} flight={item.Depart} />

                { (item.FlightType == "Round-trip") &&
                    <FlightDetail headerText="Return" departAirport={item.ArrivalAirport} arrivalAirport={item.DepartureAirport} departCity={item.ArrivalCity} arrivalCity={item.DepartureCity} flight={item.Return} />
                }
                </div>

                <div className="bg-primary-100 p-4 flex flex-col justify-center items-right text-right -m-1 md:m-0 text-primary-600 h-full">
                <div className="">
                    {item.Adults} Adults, {item.Childrens} Children, {item.Infants} Infants
                </div>
                <div className="text-xl font-semibold">{item.ClassType} Class</div>
                <div className="text-3xl font-bold mt-3">
                    ฿ {item.Price.toLocaleString()}
                </div>
                </div>
            </div>
        </div>
    );
}