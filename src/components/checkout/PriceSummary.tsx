"use client";

import { useState, useEffect } from "react";

interface PriceBreakdown {
    basePrice: number;
    taxes: number;
    fees: number;
    total: number;
}

export default function PriceSummary() {
    const [priceData, setPriceData] = useState<PriceBreakdown>({
        basePrice: 0,
        taxes: 0,
        fees: 0,
        total: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with actual API call
        const fetchPriceData = async () => {
            setIsLoading(true);
            try {
                // Dummy API call simulation
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Dummy price data
                const dummyData: PriceBreakdown = {
                    basePrice: 42000,
                    taxes: 6000,
                    fees: 2000,
                    total: 50000,
                };

                setPriceData(dummyData);
            } catch (error) {
                console.error("Error fetching price data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPriceData();
    }, []);

    const handleCancel = () => {
        // TODO: Implement cancel logic
        console.log("Cancel clicked");
    };

    const handleGoToPayment = () => {
        // TODO: Implement navigation to payment
        console.log("Go to payment clicked");
        window.location.href = "/checkout/payment";
    };

    if (isLoading) {
        return (
            <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 bg-blue-50">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded mb-2"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="border-2 border-dashed border-blue-400 rounded-lg p-6 bg-blue-50">
            {/* Price Breakdown (Optional - can be shown/hidden) */}
            <div className="mb-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>{priceData.basePrice.toLocaleString()}฿</span>
                </div>
                <div className="flex justify-between">
                    <span>Taxes & Fees:</span>
                    <span>
                        {(priceData.taxes + priceData.fees).toLocaleString()}฿
                    </span>
                </div>
                <hr className="border-gray-300" />
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Total</h3>
                <span className="text-xl font-bold text-gray-800">
                    {priceData.total.toLocaleString()}฿
                </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleCancel}
                    className="flex-1 px-4 py-3 border border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                >
                    Cancel
                </button>
                <button
                    onClick={handleGoToPayment}
                    className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                    Go to make payment
                </button>
            </div>
        </div>
    );
}
