"use client";

import {
    Cart,
    CheckoutPayload,
    useCheckout,
} from "@/src/contexts/CheckoutContext";
import { Flight } from "@/src/helper/CheckoutHelper";
import Button from "@components/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface QRModalProps {
    open: boolean;
    onClose: () => void;
}

function extractOnlyNumbers(input: string): number {
    return parseInt(input.replace(/\D/g, ""), 10);
}

async function postPaymentCompletion(
    checkoutData: CheckoutPayload,
    cartData: Cart,
    departFlight: Flight,
    returnFlight?: Flight,
) {
    const passengerData = checkoutData?.passengerData;
    const paymentData = checkoutData?.payment;

    // Calculate total amount (base price + service fees for all passengers)
    const totalAmount = passengerData.reduce((sum, passenger) => {
        const departureBaggageFee =
            passenger.baggageAllowance.departureBaggage.Price || 0;
        const returnBaggageFee =
            passenger.baggageAllowance.returnBaggage?.Price || 0;
        return sum + cartData.Price + departureBaggageFee + returnBaggageFee;
    }, 0);

    // Map passenger data to ticket format expected by API
    const tickets = passengerData.map((passenger) => ({
        Price: cartData.Price,
        ServiceFee:
            (passenger.baggageAllowance.departureBaggage.Price || 0) +
            (passenger.baggageAllowance.returnBaggage?.Price || 0),
        PassengerName: passenger.givenName,
        PassengerLastName: passenger.lastName,
        Gender: passenger.gender,
        DateOfBirth: passenger.dateOfBirth, // Should be in ISO format or parseable date string
        Nationality: passenger.nationality,
        BaggageChecked: extractOnlyNumbers(
            passenger.baggageAllowance.departureBaggage.Description,
        ), // Default or from passenger data if available
        BaggageCabin: 7, // Default or from passenger data if available
        SeatNo: passenger.seatSelection.departureSeat,
    }));
    const payload = {
        AircraftRegNo: departFlight.AircraftRegNo,
        FlightNo: departFlight.FlightNo,
        DepartTime: departFlight.DepartTime,
        ArrivalTime: departFlight.ArrivalTime,
        Tickets: tickets,
        totalAmount: totalAmount,
        method: paymentData.isQRmethod ? "MOBILE_BANKING" : "ONLINE_BANKING",
        status: "PAID",
        paymentEmail: paymentData.email,
        paymentTelNo: paymentData.telNo,
        bankName: paymentData.bankName,
    };

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        },
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Payment failed");
    }

    return await response.json();
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
        if (res.success) {
            router.push(`/payment/success/${res.data.paymentId}`);
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
                    sum +
                    cartData.Price +
                    departureBaggageFee +
                    returnBaggageFee
                );
            }, 0) || 0;
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
                    className="w-[1.75rem] h-[1.75rem]"
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
                    className="w-[17.9375rem] h-[17.9375rem] object-contain"
                />

                <div className="flex flex-col gap-[0.5rem]">
                    <div className="text-[1.5rem] font-semibold font-sans text-primary-700 text-center">
                        Total Amount: ฿{amount}
                    </div>

                    <div className="text-[1.125rem] font-semibold font-sans text-gray-300 text-center">
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
