import { Cart } from "@/src/enums/Cart";

export default function SummaryBox({selectedCount, totalPrice} : {selectedCount: number, totalPrice: number}) {
    const isButtonDisabled = (selectedCount == 0);

    return (
        <div className="border border-2 border-primary-300 rounded-lg bg-white p-3 text-lg font-bold">
            
            <div className="flex justify-between items-center mx-1 text-primary-600">
            <div className="">{Cart.SELECTED}</div>
            <div className="">{selectedCount}</div>
            </div>

            <div className="flex justify-between items-center mx-1 text-primary-600">
            <div className="">{Cart.TOTAL_PRICE}</div>
            <div className="">
                ฿ {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
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