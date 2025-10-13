"use client";

import { usePathname, useRouter } from "next/navigation";
import { use } from "react";
import Button from "../../../../components/Button";
import { checkoutPaths, isCheckoutPath } from "./helper";

interface PriceBreakdown {
    basePrice: number;
    taxes: number;
    fees: number;
    total: number;
}

// Create a cache for the price data promise
let priceDataPromise: Promise<PriceBreakdown> | null = null;

const fetchPriceData = async (): Promise<PriceBreakdown> => {
    // TODO: Replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Dummy price data
    return {
        basePrice: 42000,
        taxes: 6000,
        fees: 2000,
        total: 50000,
    };
};

const getPriceData = (): Promise<PriceBreakdown> => {
    if (!priceDataPromise) {
        priceDataPromise = fetchPriceData();
    }
    return priceDataPromise;
};

export default function PriceSummary() {
    const pathname = usePathname();
    const router = useRouter();
    const priceData = use(getPriceData()); // This will suspend until the promise resolves

    const prefixButtonText = new Map<string, string>([
        ["/checkout/info", "Cancel"],
        ["/checkout/seat", "Back"],
        ["/checkout/payment", "Back"],
    ]);
    const suffixButtonText = new Map<string, string>([
        ["/checkout/info", "Go to seat selection"],
        ["/checkout/seat", "Go to make payment"],
        ["/checkout/payment", "Go to confirmation"],
    ]);

    const handleBackButton = () => {
        if (isCheckoutPath(pathname)) {
            if (checkoutPaths.indexOf(pathname) === 0) {
                router.push("/");
            } else {
                router.push(checkoutPaths[checkoutPaths.indexOf(pathname) - 1]);
            }
        }
    };

    const handleNextButton = () => {
        if (isCheckoutPath(pathname)) {
            router.push(checkoutPaths[checkoutPaths.indexOf(pathname) + 1]);
        }
    };

    const resolvePrefixButtonText = () => {
        return prefixButtonText.get(pathname) || "Cancel";
    };

    const resolveSuffixButtonText = () => {
        return suffixButtonText.get(pathname) || "Next";
    };

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
                    text={resolvePrefixButtonText()}
                    width="w-full"
                    onClick={handleBackButton}
                    styleType="stroke"
                />
                <Button
                    text={resolveSuffixButtonText()}
                    width="w-full"
                    onClick={handleNextButton}
                />
            </div>
        </div>
    );
}
