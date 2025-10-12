"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "../Button";

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
    const pathname = usePathname();
	const suffixButtonText = new Map<string, string>([
		["/checkout/info", "Go to seat selection"],
		["/checkout/seat", "Go to make payment"],
		["/checkout/payment", "Go to confirmation"],
	]);

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

    const resolveSuffixButtonText = () => {
		return suffixButtonText.get(pathname) || "Next";
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

    if (pathname === "/checkout/payment") {
        return null;
    }

    return (
        <div className="border-2 border-primary-300 rounded-lg p-6 w-full max-w-[56.25rem]">
            {/* Total */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-primary-900">Total</h1>
                <h1 className="text-xl font-bold text-primary-900">
                    {priceData.total.toLocaleString()}฿
                </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-between">
                <Button
                    text="Cancel"
                    width="w-full"
                    onClick={handleCancel}
                    styleType="stroke"
                />
                <Button
                    text={resolveSuffixButtonText()}
                    width="w-full"
                    onClick={handleGoToPayment}
                />
            </div>
        </div>
    );
}
