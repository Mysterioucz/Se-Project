"use client";

import { useCheckout } from "@src/contexts/CheckoutContext";
import ContactInform, { ContactFormData } from "./_components/ContactInform";
import PaymentMethods from "./_components/PaymentMethods";
import QRModal from "./_components/QRModal";

export default function Page() {
    const { checkoutData, updateCheckoutData } = useCheckout();

    const handlePaymentStatusChange = (isValid: boolean, isQR: boolean, bankName: string) => {
        updateCheckoutData({
            payment: {
                ...(checkoutData?.payment ?? {}),
                isPaymentValid: isValid,
                isQRmethod: isQR,
                bankName: bankName,
            },
        });
    };
    const handleContactStatusChange = (
        isValid: boolean,
        values: ContactFormData,
    ) => {
        updateCheckoutData({
            payment: {
                ...(checkoutData?.payment ?? {}),
                isContactValid: isValid,
                email: isValid ? values.userContactEmail : "",
                telNo: isValid ? values.userTel : "",
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
