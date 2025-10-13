"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PaymentMethods from "./_components/PaymentMethods";
import ContactInform from "./_components/ContactInform";
import Button from "@components/Button";

export default function Page() {
  const router = useRouter();

  const [isPaymentValid, setIsPaymentValid] = useState(false);
  const [isContactValid, setIsContactValid] = useState(false);

  const handlePaymentStatusChange = (isValid: boolean) => {
    setIsPaymentValid(isValid);
  };
  const handleContactStatusChange = (isValid: boolean) => {
    setIsContactValid(isValid);
  };

  const isFormComplete = isPaymentValid && isContactValid;

  return (
    <div className="flex flex-row gap-[8rem] justify-between w-full">
      <div className="flex flex-col gap-[1.5rem] w-full">
        <div className="text-[3rem] font-bold text-[var(--color-primary-900)]">
          Payment
        </div>

        <div className="flex flex-col gap-[2rem]">
          <div className="gap-[2rem] p-[1.5rem] bg-[var(--color-primary-50)] rounded-[0.5rem]">
            <div className="text-[2rem] font-bold text-[var(--color-primary-900)] mb-[1.5rem]">
              Payment Methods
            </div>
            <PaymentMethods onStatusChange={handlePaymentStatusChange} />
          </div>

          <div className="gap-[2rem] p-[1.5rem] bg-[var(--color-primary-50)] rounded-[0.5rem]">
            <div className="text-[2rem] font-bold text-[var(--color-primary-900)] mb-[1.5rem]">
              Contact Information
            </div>
            <ContactInform onStatusChange={handleContactStatusChange} />
          </div>
        </div>

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
            onClick={() =>
              isFormComplete
                ? router.push("/checkout/payment/success")
                : console.log("User didn't fill in all required info")
            }
            disabled={!isFormComplete}
          />
        </div>
      </div>

      {/* Right-side Bar */}
      <div className="w-[21.25rem] h-[47.5625rem] bg-red-500"></div>
    </div>
  );
}
