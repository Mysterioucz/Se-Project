"use client";

import Button from "@components/Button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PaymentData {
    PaymentID: string;
    PaymentMethod: string;
    Amount: number;
    TransactionStatus: string;
    PaymentEmail: string;
    PaymentTelNo: string;
    BankName: string | null;
}

export default function Page() {
    const router = useRouter();
    const params = useParams();
    const { data: session } = useSession();
    const paymentId = params.PaymentID as string;

    const [bookingID, setBookingID] = useState<string>();
    const [PaymentMethods, setPaymentMethods] = useState<string>();
    const [paymentAmount, setPaymentAmount] = useState<number>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentData = async () => {
            if (!paymentId || !session?.user?.id) {
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/${paymentId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    },
                );

                const result = await response.json();

                if (result.success && result.data) {
                    const payment: PaymentData = result.data.payment;
                    setBookingID(payment.PaymentID);
                    setPaymentMethods(payment.PaymentMethod);
                    setPaymentAmount(payment.Amount);
                } else {
                    setError(result.message || "Failed to fetch payment data");
                }
            } catch (err) {
                console.error("Error fetching payment data:", err);
                setError("An error occurred while fetching payment data");
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentData();
    }, [paymentId, session?.user?.id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-xl">Loading payment details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <div className="text-xl text-red-600">{error}</div>
                <Button
                    text="Back to Home"
                    align="center"
                    styleType="fill"
                    size="md"
                    width="w-auto"
                    height="h-auto"
                    onClick={() => router.push("/")}
                />
            </div>
        );
    }

    return (
        <div className="mx-[8rem] mt-[2rem] flex w-full flex-col gap-[2.5rem] rounded-[0.5rem] border-[0.125rem] border-[var(--color-success-main)] bg-white px-[5rem] py-[3rem]">
            <div className="flex w-full flex-col items-center justify-center gap-[0.75rem]">
                <Image
                    src="/payment/Success.svg"
                    alt="Success Icon"
                    width={48}
                    height={48}
                />
                <div className="flex flex-col gap-[0.5rem]">
                    <div className="text-center text-[3rem] font-bold text-[var(--color-success-dark)]">
                        Payment Successful !
                    </div>
                    <div className="text-center text-[1.5rem] font-semibold text-[var(--color-gray-400)]">
                        Booking ID: {bookingID}
                    </div>
                </div>
            </div>
            <div className="flex w-full flex-col gap-[1.5rem]">
                <div className="flex flex-col gap-[1.5rem]">
                    <div className="flex justify-between rounded-[0.5rem] bg-[var(--color-success-lighter)] p-[1.25rem]">
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
                            What&apos;s next?
                        </div>
                        <div className="flex flex-col gap-[0.5rem] pl-[2rem]">
                            <div className="text-[1rem] font-semibold text-[var(--color-gray-300)]">
                                Check confirmation email sent to your registered
                                email
                            </div>
                            <div className="text-[1rem] font-semibold text-[var(--color-gray-300)]">
                                Dowload ticket from your booking history
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-[1rem]">
                        <Button
                            text="Back to Home page"
                            align="center"
                            styleType="stroke"
                            size="md"
                            width="w-full"
                            height="h-full"
                            // This will navigate back to the main search page
                            onClick={() => router.push("/")}
                        />
                        <Button
                            text="View Booking detail"
                            align="center"
                            styleType="fill"
                            size="md"
                            width="w-full"
                            height="h-full"
                            onClick={() =>
                                router.push(`/order-summary/${paymentId}`)
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
