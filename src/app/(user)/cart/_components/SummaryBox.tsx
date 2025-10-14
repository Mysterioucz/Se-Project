import { Cart } from "@/src/enums/Cart";

export default function SummaryBox({selectedCount, totalPrice} : {selectedCount: number, totalPrice: number}) {
    const isButtonDisabled = (selectedCount == 0);

    return (
        <div className="border border-2 border-primary-300 rounded-lg bg-white p-3 font-bold">
            
            <div className="flex justify-between items-center mx-1 text-xl text-primary-600 font-bold">
            <p className="">{Cart.SELECTED}</p>
            <p className="">{selectedCount}</p>
            </div>

            <div className="flex justify-between items-center mx-1 text-xl text-primary-600">
            <p className="">{Cart.TOTAL_PRICE}</p>
            <p className="">
                ฿ {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            </div>


            <button
            disabled={isButtonDisabled}
            className={`w-full mt-3 py-3 rounded-lg font-bold transition-colors text-lg ${
                isButtonDisabled
                ? 'bg-gray-100 cursor-not-allowed text-gray-400'
                : 'bg-primary-600 hover:bg-teal-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
            }`}
            >
                {Cart.NEXT}
            </button>
        </div>
    );
}