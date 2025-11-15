"use client";

import { useCheckout } from "@/src/contexts/CheckoutContext";
import Button from "@components/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { postPaymentCompletion } from "../../_components/helper";

interface QRModalProps {
    open: boolean;
    onClose: () => void;
}

export default function QRModal({ open, onClose }: QRModalProps) {
    const router = useRouter();
    const [amount, setAmount] = useState<number>(0);
    const { checkoutData, cartData, departFlight, returnFlight } =
        useCheckout();

    const handlePaymentComplete = async () => {
        const res = await postPaymentCompletion(
            checkoutData!,
            cartData,
            departFlight,
            returnFlight,
        );
        console.log("Payment Response:", res);
        if (res.success && res.data.payment.PaymentID) {
            router.push(`/payment-success/${res.data.payment.PaymentID}`);
        }
    };
    useEffect(() => {
        if (!open) return;
        // Calculate total amount (base price + service fees for all passengers)
        const totalAmount =
            checkoutData?.passengerData.reduce((sum, passenger) => {
                const departureBaggageFee =
                    passenger.baggageAllowance.departureBaggage.Price || 0;
                const returnBaggageFee =
                    passenger.baggageAllowance.returnBaggage?.Price || 0;
                return (
                    cartData.Price +
                    departureBaggageFee +
                    returnBaggageFee
                );
            }, 0) || 0;
        console.log(checkoutData.passengerData);
        setAmount(totalAmount);
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: { sx: { borderRadius: "1rem", padding: "1rem" } },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    fontWeight: "bold",
                    fontSize: "2rem",
                    color: "var(--color-primary-900)",
                }}
            >
                <img
                    src="/payment/ScanIcon.svg"
                    alt="Payment Icon"
                    className="h-[1.75rem] w-[1.75rem]"
                />
                Scan to Pay
            </DialogTitle>

            <DialogContent
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                }}
            >
                <img
                    src="/payment/QR.svg"
                    alt="QR Code"
                    className="h-[17.9375rem] w-[17.9375rem] object-contain"
                />

                <div className="flex flex-col gap-[0.5rem]">
                    <div className="text-primary-700 text-center font-sans text-[1.5rem] font-semibold">
                        Total Amount: ฿{amount}
                    </div>

                    <div className="text-center font-sans text-[1.125rem] font-semibold text-gray-300">
                        Scan this QR code with your banking app to complete{" "}
                        <br /> the payment
                    </div>
                </div>
            </DialogContent>

            <DialogActions
                sx={{ display: "flex-row", justifyContent: "center", pb: 2 }}
            >
                <Button
                    text="Cancel"
                    align="center"
                    styleType="stroke"
                    size="md"
                    width="w-full"
                    height="h-full"
                    onClick={onClose}
                />
                <Button
                    text="Payment Complete"
                    align="center"
                    styleType="fill"
                    size="md"
                    width="w-full"
                    height="h-full"
                    onClick={handlePaymentComplete}
                />
            </DialogActions>
        </Dialog>
    );
}
