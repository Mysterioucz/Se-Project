"use client";

import Button from "@/src/components/Button";
import { useCheckout } from "@/src/contexts/CheckoutContext";
import { usePathname, useRouter } from "next/navigation";
import { checkoutPaths, isCheckoutPath } from "./helper";

export default function FooterButton({ cartId }: { cartId: string }) {
    let pathname = usePathname();
    pathname = pathname.replace(`/${cartId}`, "");
    const router = useRouter();
    const { checkoutData, updateCheckoutData } = useCheckout();
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
            if (isQRmethod) {
                setQRModalOpen(true);
            } else {
                router.push(
                    `/${cartId}` +
                        checkoutPaths[checkoutPaths.indexOf(pathname) + 1],
                );
            }
        }
    };

    const resolvePrefixButtonText = () => {
        return prefixButtonText.get(pathname) || "Cancel";
    };

    const resolveSuffixButtonText = () => {
        return suffixButtonText.get(pathname) || "Next";
    };

    return (
        //Action Buttons
        <div className="flex w-full h-fit px-60 gap-6 justify-between">
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
                disabled={
                    !(isPaymentValid && isContactValid) &&
                    pathname === `/checkout/payment`
                }
            />
        </div>
    );
}
