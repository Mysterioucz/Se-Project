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
    const res = input.replace(/\D/g, "");
    if (res === "") return 0;
    return parseInt(res, 10);
}

function str2DateTime(dateStr: string): Date {
    // Assuming dateStr is in the format "DD/MM/YY" or similar ISO format
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year + 2000, month - 1, day);
}

async function postPaymentCompletion(
    checkoutData: CheckoutPayload,
    cartData: Cart,
    departFlight: Flight,
    returnFlight?: Flight,
) {
    const passengerData = checkoutData?.passengerData;
    const paymentData = checkoutData?.payment;

    // Calculate price per passenger (total cart price divided by number of passengers)
    const totalPassengers = cartData.Adults + cartData.Childrens + cartData.Infants;
    const pricePerPassenger = cartData.Price / totalPassengers;

    // Create tickets array - for round trip, each passenger gets 2 tickets (departure + return)
    const tickets = [];
    
    for (const passenger of passengerData) {
        // Departure ticket for this passenger
        const departureBaggageFee = passenger.baggageAllowance.departureBaggage.Price || 0;
        
        tickets.push({
            Price: pricePerPassenger,
            ServiceFee: departureBaggageFee,
            PassengerName: passenger.givenName,
            PassengerLastName: passenger.lastName,
            Gender: passenger.gender,
            DateOfBirth: new Date(passenger.dateOfBirth.split("/").reverse().join("-")),
            Nationality: passenger.nationality,
            BaggageChecked: extractOnlyNumbers(
                passenger.baggageAllowance.departureBaggage.Description
            ),
            BaggageCabin: 7,
            SeatNo: passenger.seatSelection.departureSeat,
            AircraftRegNo: departFlight.AircraftRegNo,
            FlightNo: departFlight.FlightNo,
            DepartTime: departFlight.DepartTime,
            ArrivalTime: departFlight.ArrivalTime,
            PassportNo: passenger.passportNo || undefined,
            PassportExpiry: passenger.expiryDate 
                ? new Date(passenger.expiryDate.split("/").reverse().join("-"))
                : undefined,
        });

        // Return ticket for this passenger (if round trip)
        if (returnFlight && cartData.FlightType.toLowerCase().includes("round")) {
            const returnBaggageFee = passenger.baggageAllowance.returnBaggage?.Price || 0;
            
            tickets.push({
                Price: pricePerPassenger,
                ServiceFee: returnBaggageFee,
                PassengerName: passenger.givenName,
                PassengerLastName: passenger.lastName,
                Gender: passenger.gender,
                DateOfBirth: new Date(passenger.dateOfBirth.split("/").reverse().join("-")),
                Nationality: passenger.nationality,
                BaggageChecked: extractOnlyNumbers(
                    passenger.baggageAllowance.returnBaggage?.Description || ""
                ),
                BaggageCabin: 7,
                SeatNo: passenger.seatSelection.returnSeat || "",
                AircraftRegNo: returnFlight.AircraftRegNo,
                FlightNo: returnFlight.FlightNo,
                DepartTime: returnFlight.DepartTime,
                ArrivalTime: returnFlight.ArrivalTime,
                PassportNo: passenger.passportNo || undefined,
                PassportExpiry: passenger.expiryDate 
                    ? new Date(passenger.expiryDate.split("/").reverse().join("-"))
                    : undefined,
            });
        }
    }

    // Calculate total amount (sum of all ticket prices and service fees)
    const totalAmount = tickets.reduce((sum, ticket) => {
        return sum + ticket.Price + (ticket.ServiceFee || 0);
    }, 0);

    const payload = {
        Tickets: tickets,
        totalAmount: totalAmount,
        method: paymentData.isQRmethod ? "QR_CODE" : "ONLINE_BANKING",
        status: "PAID",
        paymentEmail: paymentData.email,
        paymentTelNo: paymentData.telNo,
        bankName: paymentData.bankName || undefined,
        Adults: cartData.Adults,
        Childrens: cartData.Childrens,
        Infants: cartData.Infants,
        FlightType: cartData.FlightType,
        ClassType: cartData.ClassType,
        DepartFlightNo: departFlight.FlightNo,
        DepartFlightDepartTime: departFlight.DepartTime,
        DepartFlightArrivalTime: departFlight.ArrivalTime,
        ReturnFlightNo: returnFlight?.FlightNo,
        ReturnFlightDepartTime: returnFlight?.DepartTime,
        ReturnFlightArrivalTime: returnFlight?.ArrivalTime,
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
        console.log("Payment Response:", res);
        const PaymentID = res.data.PaymentID;
        if (res.success) {
            router.push(`/payment/success/${PaymentID}`);
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
