
// const FlightDetail = ({ leg, type }) => (
//   <div className="mt-2">
//     <div className="flex items-center text-sm font-semibold text-gray-600">
//       <p className="w-16">{type}</p>
//       <p className="ml-4 text-gray-800">{leg.airline}</p>
//       <p className="ml-auto text-gray-500">{leg.date}</p>
//     </div>
//     <div className="mt-4 flex items-center justify-between">
//       <div className="text-left">
//         <p className="text-2xl font-bold text-gray-800">{leg.departure.time}</p>
//         <p className="text-sm font-semibold">{leg.departure.airportCode}</p>
//         <p className="text-xs text-gray-500">{leg.departure.city}</p>
//       </div>

//       <div className="flex-grow text-center px-4">
//         <p className="text-xs text-gray-500">{leg.duration}</p>
//         <div className="relative h-px bg-gray-300 my-1">
//           {/* <PlaneIcon className="w-4 h-4 text-teal-600 bg-white p-0.5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" /> */}
//         </div>
//         {leg.layover && <p className="text-xs text-teal-700">{leg.layover}</p>}
//       </div>

//       <div className="text-right">
//         <p className="text-2xl font-bold text-gray-800">{leg.arrival.time}</p>
//         <p className="text-sm font-semibold">{leg.arrival.airportCode}</p>
//         <p className="text-xs text-gray-500">{leg.arrival.city}</p>
//       </div>
//     </div>
//   </div>
// );

// export default function CartItem({ item, isSelected, onSelect, onRemove } : { item, isSelected:boolean, onSelect:, onRemove: }) {
export default function CartItem() {

    return (
        <div className="border-3 border-primary-300 rounded-lg mb-6 overflow-hidden">
            <div className="bg-primary-300 p-3 flex items-center justify-between">
                <div className="flex items-center">
                <input
                    type="checkbox"
                    className="h-5 w-5 rounded mx-2 bg-primary-300 text-primary focus:white cursor-pointer"
                    // checked={isSelected}
                    // onChange={() => onSelect(item.id)}
                />
                <h3 className="ml-2 font-bold text-xl text-white">
                    {/* {item.type === 'one-way' ? 'One-way' : 'Round Trip'}: {item.fromAirport} to {item.toAirport} */}
                </h3>
                </div>
                {/* <button onClick={() => onRemove(item.id)} className="flex items-center text-sm text-red-600 hover:text-red-800 transition-colors">
                <DeleteOutline className="w-4 h-4 mr-1" />
                Remove
                </button> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white">
                <div className="md:col-span-2">
                {/* <FlightDetail leg={item.departLeg} type="Depart" />
                {item.returnLeg && (
                    <div className="mt-4 pt-4 border-t border-dashed">
                    <FlightDetail leg={item.returnLeg} type="Return" />
                    </div>
                )} */}
                </div>

                <div className="bg-teal-50 rounded-lg p-4 flex flex-col justify-center items-center text-center -m-1 md:m-0">
                {/* <p className="font-semibold text-teal-800">{item.passengers}</p>
                <p className="text-sm text-teal-700">{item.cabinClass}</p>
                <p className="text-3xl font-bold text-teal-900 mt-4">
                    ฿ {item.price.toLocaleString()}
                </p> */}
                </div>
            </div>
        </div>
    );
}