"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Button from "@components/Button";

export default function Page() {
  const router = useRouter();

  const [bookingID, setBookingID] = useState<string>();
  const [PaymentMethods, setPaymentMethods] = useState<string>();
  const [paymentAmount, setPaymentAmount] = useState<number>();

  useEffect(() => {
    // TODO: Fetch actual data from backend to get bookingID, payment method and amount
    setBookingID("A123456789");
    setPaymentMethods("Mobile Banking");
    setPaymentAmount(1234.56);
  }, []);

  return (
    <div className="flex flex-col gap-[2.5rem] px-[4rem] py-[1.5rem] bg-white rounded-[0.5rem] border-[var(--color-success-main)] border-[0.125rem] w-full mx-[8rem]">
      <div className="gap-[0.75rem] justify-center flex flex-col items-center w-full">
        <Image
          src="/payment/success.svg"
          alt="Success Icon"
          width={48}
          height={48}
        />
        <div className="flex flex-col gap-[0.5rem]">
          <div className="text-[3rem] text-[var(--color-success-dark)] font-bold text-center">
            Payment Successful !
          </div>
          <div className="text-[1.5rem] text-[var(--color-gray-400)] font-semibold text-center">
            Booking ID: {bookingID}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-[1.5rem] w-full">
        <div className="flex flex-col gap-[1.5rem]">
          <div className="flex justify-between p-[1.25rem] bg-[var(--color-success-lighter)] rounded-[0.5rem]">
            <div className="flex flex-col gap-[1.5rem]">
              <div className="text-[1.125rem] font-semibold text-[var(--color-gray-400)]">
                Payment Method
              </div>
              <div className="text-[1.125rem] font-semibold text-[var(--color-gray-900)]">
                {PaymentMethods}
              </div>
            </div>
            <div className="flex flex-col gap-[1.5rem] text-right">
              <div className="text-[1.125rem] font-semibold text-[var(--color-gray-400)]">
                Total Amount
              </div>
              <div className="text-[1.125rem] font-semibold text-[var(--color-gray-900)]">
                ฿ {paymentAmount}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[1rem]">
            <div className="text-[1rem] font-bold text-[var(--color-gray-300)]">
              What's next?
            </div>
            <div className="flex flex-col gap-[0.5rem] pl-[2rem]">
              <div className="text-[1rem] font-semibold text-[var(--color-gray-300)]">
                Check confirmation email sent to your registered email
              </div>
              <div className="text-[1rem] font-semibold text-[var(--color-gray-300)]">
                Dowload ticket from your booking history
              </div>
            </div>
          </div>
          <div className="flex gap-[1rem]">
            <Button
              text="Back"
              align="center"
              styleType="stroke"
              size="md"
              width="w-full"
              height="h-full"
              // This will navigate back to the main search page
              onClick={() => router.push("/")}
            />
            <Button
              text="Confirm Payment"
              align="center"
              styleType="fill"
              size="md"
              width="w-full"
              height="h-full"
              // TODO: Implement router to Confirmation page
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
