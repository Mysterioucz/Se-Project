"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ContactInform from "./_components/ContactInform";
import PaymentMethods from "./_components/PaymentMethods";
import QRModal from "./_components/QRModal";
import Button from "@components/Button";

export default function Page() {
  const router = useRouter();

  // TODO: Fetch actual data from backend to check if user fill in all required info
  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [isQRmethod, setQRmethod] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);
  const [isQRModalOpen, setQRModalOpen] = useState(false);

  const handlePaymentStatusChange = (isValid: boolean) => {
    setIsPaymentValid(isValid);
  };
  const handleQRmethodChange = (isQR: boolean) => {
    setQRmethod(isQR);
  };
  const handleContactStatusChange = (isValid: boolean) => {
    setIsContactValid(isValid);
  };

  const isFormComplete = isPaymentValid && isContactValid;

  const handleConfirmPayment = () => {
    if (!isFormComplete) {
      console.log("User didn't fill in all required info");
      return;
    }

    if (isQRmethod) {
      setQRModalOpen(true);
    } else {
      router.push("/payment-success");
    }
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

{/* Do NOT delete these comments it's essential for adapt with Footer global component */}

        <div className="flex gap-[1.5rem] h-[3.5rem]">
          <Button
            text="Back"
            align="center"
            styleType="stroke"
            size="md"
            width="w-full"
            height="h-full"
            // This will navigate back to the previous page without saving any changes made on the current page
            onClick={() => router.back()}
          />
          <Button
            text="Confirm Payment"
            align="center"
            styleType="fill"
            size="md"
            width="w-full"
            height="h-full"
            // TODO: Implement layout from fetched data from backend when user fill in wrong info after click Confirm Payment button
            onClick={handleConfirmPayment}
            disabled={!isFormComplete}
          />
        </div>
      </div>

      <QRModal
        open={isQRModalOpen}
        onClose={() => setQRModalOpen(false)}
      />
    </div>
  );
}
