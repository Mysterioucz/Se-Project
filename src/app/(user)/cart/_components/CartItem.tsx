import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { CartType } from '../enums/CartType';
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
                    className="h-5 w-5 rounded mx-2 bg-primary-300 text-primary focus:white cursor-pointer"
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white">
                <div className="md:col-span-2">
                <FlightDetail item={item} />
                { (item.FlightType == "Round-trip")

                }
                {/* <FlightDetail leg={item.departLeg} type="Depart" />
                {item.returnLeg && (
                    <div className="mt-4 pt-4 border-t border-dashed">
                    <FlightDetail leg={item.returnLeg} type="Return" />
                    </div>
                )} */}
                </div>

                <div className="bg-primary-100 rounded-lg p-4 flex flex-col justify-center items-center text-center -m-1 md:m-0 text-primary-600">
                <div className="font-semibold">
                    {item.Adults} Adults, {item.Childrens} Children, {item.Infants} Infants
                </div>
                <div className="text-xl">{item.ClassType}</div>
                <div className="text-3xl font-bold mt-4">
                    ฿ {item.Price.toLocaleString()}
                </div>
                </div>
            </div>
        </div>
    );
}