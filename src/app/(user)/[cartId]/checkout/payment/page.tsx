"use client";

import { useCheckout } from "@src/contexts/CheckoutContext";
import ContactInform from "./_components/ContactInform";
import PaymentMethods from "./_components/PaymentMethods";
import QRModal from "./_components/QRModal";

export default function Page() {
    const { checkoutData, updateCheckoutData } = useCheckout();

    // TODO: Fetch actual data from backend to check if user fill in all required info

    const handlePaymentStatusChange = (isValid: boolean) => {
        updateCheckoutData({
            payment: {
                ...(checkoutData?.payment ?? {}),
                isPaymentValid: isValid,
            },
        });
    };
    const handleQRmethodChange = (isQR: boolean) => {
        console.log("QR method selected:", isQR);
        updateCheckoutData({
            payment: {
                ...(checkoutData?.payment ?? {}),
                isQRmethod: isQR,
            },
        });
    };
    const handleContactStatusChange = (isValid: boolean) => {
        updateCheckoutData({
            payment: {
                ...(checkoutData?.payment ?? {}),
                isContactValid: isValid,
            },
        });
    };

    const isQRModalOpen = checkoutData?.payment?.isQRModalOpen ?? false;
    const setQRModalOpen = (val: boolean) => {
        updateCheckoutData({
            payment: {
                ...(checkoutData?.payment ?? {}),
                isQRModalOpen: val,
            },
        });
    };

    return (
        <div className="flex flex-row gap-[8rem] justify-between pb-[2rem] w-full">
            <div className="flex flex-col gap-[1.5rem] w-full">
                <div className="text-[3rem] font-bold text-[var(--color-primary-900)]">
                    Payment
                </div>

                <div className="flex flex-col gap-[2rem]">
                    <div className="gap-[2rem] p-[1.5rem] bg-[var(--color-primary-50)] rounded-[0.5rem]">
                        <div className="text-[2rem] font-bold text-[var(--color-primary-900)] mb-[1.5rem]">
                            Payment Methods
                        </div>
                        <PaymentMethods
                            onStatusChange={handlePaymentStatusChange}
                            onQRmethodChange={handleQRmethodChange}
                        />
                    </div>

                    <div className="gap-[2rem] p-[1.5rem] bg-[var(--color-primary-50)] rounded-[0.5rem]">
                        <div className="text-[2rem] font-bold text-[var(--color-primary-900)] mb-[1.5rem]">
                            Contact Information
                        </div>
                        <ContactInform
                            onStatusChange={handleContactStatusChange}
                        />
                    </div>
                </div>
            </div>

            <QRModal
                open={isQRModalOpen}
                onClose={() => setQRModalOpen(false)}
            />
        </div>
    );
}
