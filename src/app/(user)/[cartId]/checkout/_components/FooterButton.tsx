"use client";

import Button from "@/src/components/Button";
import { useCheckout } from "@/src/contexts/CheckoutContext";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { checkoutPaths, isCheckoutPath } from "./helper";

export default function FooterButton({ cartId }: { cartId: string }) {
    let pathname = usePathname();
    pathname = pathname.replace(`/${cartId}`, "");
    const router = useRouter();
    const { checkoutData, updateCheckoutData, areAllSeatsSelected } =
        useCheckout();
    const { isPaymentValid, isContactValid, isQRmethod } = checkoutData.payment;
    const prefixButtonText = new Map<string, string>([
        [`/checkout/info`, "Cancel"],
        [`/checkout/seat`, "Back"],
        [`/checkout/payment`, "Back"],
    ]);
    const suffixButtonText = new Map<string, string>([
        [`/checkout/info`, "Go to seat selection"],
        [`/checkout/seat`, "Go to make payment"],
        [`/checkout/payment`, "Confirm Payment"],
    ]);

    const setQRModalOpen = (isOpen: boolean) => {
        // This function would ideally update the QR modal state in the context
        // but for this snippet, we will leave it as a placeholder.
        updateCheckoutData({
            payment: {
                ...checkoutData.payment,
                isQRModalOpen: isOpen,
            },
        });
    };

    const handleBackButton = () => {
        if (isCheckoutPath(pathname)) {
            if (checkoutPaths.indexOf(pathname) === 0) {
                router.push("/");
            } else {
                router.push(
                    `/${cartId}` +
                        checkoutPaths[checkoutPaths.indexOf(pathname) - 1],
                );
            }
        }
    };

    const handleNextButton = () => {
        if (isCheckoutPath(pathname)) {
            if (pathname === `/checkout/payment` && isQRmethod) {
                setQRModalOpen(true);
            } else {
                const nextIdx = checkoutPaths.indexOf(pathname) + 1;
                router.push(`/${cartId}` + checkoutPaths[nextIdx]);
            }
        }
    };

    const resolveDisabledState = () => {
        if (pathname === `/checkout/payment`) {
            return !(isPaymentValid && isContactValid);
        } else if (pathname === `/checkout/info`) {
            return !checkoutData.info?.isValid;
        } else if (pathname === `/checkout/seat`) {
            return !areAllSeatsSelected();
        }
        return false;
    };

    const resolvePrefixButtonText = () => {
        return prefixButtonText.get(pathname) || "Cancel";
    };

    const resolveSuffixButtonText = () => {
        return suffixButtonText.get(pathname) || "Next";
    };

    const getDisabledMessage = () => {
        if (pathname === `/checkout/seat` && !areAllSeatsSelected()) {
            return "Please select seats for all passengers";
        } else if (
            pathname === `/checkout/info` &&
            !checkoutData.info?.isValid
        ) {
            return "Please fill in all passenger information";
        } else if (pathname === `/checkout/payment`) {
            if (!isPaymentValid) return "Please select a payment method";
            if (!isContactValid) return "Please provide contact information";
        }
        return "";
    };

    const [showTooltip, setShowTooltip] = useState(false);

    const isDisabled = resolveDisabledState();
    const disabledMessage = getDisabledMessage();

    return (
        //Action Buttons
        <div className="flex h-fit w-full justify-between gap-6 px-60">
            <Button
                text={resolvePrefixButtonText()}
                width="w-full"
                onClick={handleBackButton}
                styleType="stroke"
            />
            <div className="relative w-full">
                <Button
                    text={resolveSuffixButtonText()}
                    width="w-full"
                    onClick={handleNextButton}
                    disabled={isDisabled}
                    onMouseEnter={() => isDisabled && setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                />
                {isDisabled && showTooltip && disabledMessage && (
                    <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-lg bg-gray-800 px-3 py-2 text-sm whitespace-nowrap text-white shadow-lg">
                        {disabledMessage}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
