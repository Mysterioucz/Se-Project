import { Cart } from "@/src/enums/Cart";
import { useRouter } from "next/navigation";

export default function SummaryBox({
    selectedCount,
    totalPrice,
    cartId,
}: {
    selectedCount: number;
    totalPrice: number;
    cartId: number;
}) {
    const isButtonDisabled = selectedCount == 0;
    const router = useRouter();
    const handleBtnClick = () => {
        // Handle button click logic here
        if (cartId === -1) {
            alert("Please select some cart's items first.");
            return;
        }
        router.push(`/${cartId}/checkout/info`);
    };

    return (
        <div className="border-2 border-primary-300 rounded-lg bg-white p-3 text-lg font-bold">
            <div className="flex justify-between items-center mx-1 text-primary-600">
                <div className="">{Cart.SELECTED}</div>
                <div className="">{selectedCount}</div>
            </div>

            <div className="flex justify-between items-center mx-1 text-primary-600">
                <div className="">{Cart.TOTAL_PRICE}</div>
                <div className="">
                    ฿{" "}
                    {totalPrice.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </div>
            </div>

            <button
                disabled={isButtonDisabled}
                className={`w-full mt-3 py-3 rounded-lg font-bold transition-colors text-lg ${
                    isButtonDisabled
                        ? "bg-gray-100 cursor-not-allowed text-gray-400"
                        : "bg-primary-600 hover:bg-primary-800 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                }`}
                onClick={handleBtnClick}
            >
                {Cart.NEXT}
            </button>
        </div>
    );
}
