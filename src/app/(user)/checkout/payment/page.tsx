"use client";

import { useRouter } from "next/navigation";
import ContactInform from "./_components/ContactInform";
import PaymentMethods from "./_components/PaymentMethods";
import QRModal from "./_components/QRModal";
import { useCheckout } from "@src/contexts/CheckoutContext"

export default function Page() {
  const {
    isPaymentValid,
    setIsPaymentValid,
    isContactValid,
    setIsContactValid,
    isQRmethod,
    setQRmethod,
    isQRModalOpen,
    setQRModalOpen,
  } = useCheckout();

  // TODO: Fetch actual data from backend to check if user fill in all required info

  const handlePaymentStatusChange = (isValid: boolean) => {
    setIsPaymentValid(isValid);
  };
  const handleQRmethodChange = (isQR: boolean) => {
    setQRmethod(isQR);
  };
  const handleContactStatusChange = (isValid: boolean) => {
    setIsContactValid(isValid);
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
