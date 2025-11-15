import { Cart, CheckoutPayload } from "@/src/contexts/checkout/types";
import { Flight } from "@/src/helper/CheckoutHelper";

export const checkoutPaths = [
    "/checkout/info",
    "/checkout/seat",
    "/checkout/payment"
];
export function isCheckoutPath(path: string) {
    for (const p of checkoutPaths) {
        if (path.includes(p)) {
            return true;
        }
    }
    return false;
}

export function extractOnlyNumbers(input: string): number {
    const res = input.replace(/\D/g, "");
    if (res === "") return 0;
    return parseInt(res, 10);
}

export function str2DateTime(dateStr: string): Date {
    // Assuming dateStr is in the format "DD/MM/YY" or similar ISO format
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year + 2000, month - 1, day);
}

export async function postPaymentCompletion(
    checkoutData: CheckoutPayload,
    cartData: Cart,
    departFlight: Flight,
    returnFlight?: Flight,
) {
    const passengerData = checkoutData?.passengerData;
    const paymentData = checkoutData?.payment;

    // Calculate price per passenger (total cart price divided by number of passengers)
    const totalPassengers =
        cartData.Adults + cartData.Childrens + cartData.Infants;
    const pricePerPassenger = cartData.Price / totalPassengers;

    // Create tickets array - for round trip, each passenger gets 2 tickets (departure + return)
    const tickets = [];

    for (const passenger of passengerData) {
        // Departure ticket for this passenger
        const departureBaggageFee =
            passenger.baggageAllowance.departureBaggage.Price || 0;

        tickets.push({
            Price: pricePerPassenger,
            ServiceFee: departureBaggageFee,
            PassengerName: passenger.givenName,
            PassengerLastName: passenger.lastName,
            Gender: passenger.gender,
            DateOfBirth: new Date(
                passenger.dateOfBirth.split("/").reverse().join("-"),
            ),
            Nationality: passenger.nationality,
            BaggageChecked: extractOnlyNumbers(
                passenger.baggageAllowance.departureBaggage.Description,
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
        if (
            returnFlight &&
            cartData.FlightType.toLowerCase().includes("round")
        ) {
            const returnBaggageFee =
                passenger.baggageAllowance.returnBaggage?.Price || 0;

            tickets.push({
                Price: pricePerPassenger,
                ServiceFee: returnBaggageFee,
                PassengerName: passenger.givenName,
                PassengerLastName: passenger.lastName,
                Gender: passenger.gender,
                DateOfBirth: new Date(
                    passenger.dateOfBirth.split("/").reverse().join("-"),
                ),
                Nationality: passenger.nationality,
                BaggageChecked: extractOnlyNumbers(
                    passenger.baggageAllowance.returnBaggage?.Description || "",
                ),
                BaggageCabin: 7,
                SeatNo: passenger.seatSelection.returnSeat || "",
                AircraftRegNo: returnFlight.AircraftRegNo,
                FlightNo: returnFlight.FlightNo,
                DepartTime: returnFlight.DepartTime,
                ArrivalTime: returnFlight.ArrivalTime,
                PassportNo: passenger.passportNo || undefined,
                PassportExpiry: passenger.expiryDate
                    ? new Date(
                          passenger.expiryDate.split("/").reverse().join("-"),
                      )
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
