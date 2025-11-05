"use client"
import Button from "@/src/components/Button";
import FlightDetailSummary from "@/src/app/(user)/order-history/order-summary/_components/flightDetailSummary";
import PassengerInfoSummary from "@/src/app/(user)/order-history/order-summary/_components/passengerInfoSummary";
import PaymentDetailSummary from "@/src/app/(user)/order-history/order-summary/_components/paymentDetailSummary";
import PriceBreakdownCard from "@/src/app/(user)/order-history/order-summary/_components/priceBreakdownCard";
import { FlightLegTypes } from "@/src/enums/FlightLegTypes";
import { PassengerTypes } from "@/src/enums/PassengerTypes";
import { redirect } from "next/navigation";
import formatDateLocal from "@/src/lib/formatDateLocal";
import { formatToShortDate, formatToTime } from "../../../cart/[AccountID]/_components/FlightDetail";

export interface Airport {
    AirportID: string;
    AirportName: string;
    City: string;
    Country: string;
}

export interface Flight {
    FlightNo: string;
    DepartTime: string;      // ISO string from Date
    ArrivalTime: string;     // ISO string from Date
    AirlineName: string;
    Aircraft?: string | null;
    departureAirport: Airport;
    arrivalAirport: Airport;
}

export interface PaymentData {
    PaymentID: string;
    PaymentDateTime: string;
    PaymentMethod: String;
    TransactionStatus: string;
    PaymentEmail: string;
    PaymentTelNo: string;
    BankName: string | null;
    Amount: number;
    CreatedAt: string;
    Adults: number;
    Childrens: number;
    Infants: number;
    ClassType: string;
    FlightType: string;
    DepartFlight: Flight;
    ReturnFlight?: Flight | null;
}

export interface Ticket {
    TicketID: string;
    Price: number;
    ServiceFee?: number | null;
    TicketStatus: string;
    PassengerName: string;
    PassengerLastName: string;
    Gender: string;
    DateOfBirth: string;
    Nationality: string;
    SeatNo: string;
    BaggageChecked?: string | null;
    BaggageCabin?: string | null;
    PassportNo?: string | null;
    PassportExpiry?: string | null;
}

export interface PaymentsApiResponse {
    payment: PaymentData;
    tickets: Ticket[];
}

export default function PageClient(
    { data, UserAccountID } : { data:PaymentsApiResponse, UserAccountID: string } 
) {
    const flightType = data.payment.FlightType;

    // Example ticket data
    const tickets = [
        { type: PassengerTypes.Adult, price: 1000, quantity: 1 },
        { type: PassengerTypes.Child, price: 700, quantity: 2 },
    ];
    //Eample bagge
    const baggage = {
        personal_item_price: 0,
        carry_on_item_price: 200,
        checked_baggage_price: 300,
    };

    let paymentDetail = {
        bookingId: data.payment.PaymentID,
        paymentMethod: data.payment.PaymentMethod
    }

    if (paymentDetail.paymentMethod === "QR_CODE") {
        paymentDetail.paymentMethod = "QR Code";
    } else {
        paymentDetail.paymentMethod = "Online Banking"
    }

    const passengers = data.tickets.map((ticket) => ({
        GivenName: ticket.PassengerName,
        LastName: ticket.PassengerLastName,
        GenderOnID: ticket.Gender,
        Birthdate: formatDateLocal(ticket.DateOfBirth),
        Nationality: ticket.Nationality,
        SeatNo: ticket.SeatNo,
        PassportNo: ticket.PassportNo ?? null,
        PassportExpiryDate: formatDateLocal(ticket.PassportExpiry ?? null)
    }));

    const flightDetail = {
        flightLeg: FlightLegTypes.DEPARTURE,
        departurePlace: data.payment.DepartFlight.departureAirport.City,
        arrivalPlace: data.payment.DepartFlight.arrivalAirport.City,
        airline: data.payment.DepartFlight.AirlineName,
        flightNumber: data.payment.DepartFlight.FlightNo,
        cabinClass: data.payment.ClassType,
        segments: [
            {
                Time: formatToTime(new Date(data.payment.DepartFlight.DepartTime)),
                Date: formatDateLocal(data.payment.DepartFlight.DepartTime),
                Airport: data.payment.DepartFlight.departureAirport.AirportID,
                Place: data.payment.DepartFlight.departureAirport.AirportName
            }, {
                Time: formatToTime(new Date(data.payment.DepartFlight.ArrivalTime)),
                Date: formatDateLocal(data.payment.DepartFlight.ArrivalTime),
                Airport: data.payment.DepartFlight.arrivalAirport.AirportID,
                Place: data.payment.DepartFlight.arrivalAirport.AirportName
            }
        ]
    }

    const returnFlightDetail = {
        flightLeg: FlightLegTypes.RETURN,
        departurePlace: data.payment.ReturnFlight?.departureAirport.City,
        arrivalPlace: data.payment.ReturnFlight?.arrivalAirport.City,
        airline: data.payment.ReturnFlight?.AirlineName,
        flightNumber: data.payment.ReturnFlight?.FlightNo,
        cabinClass: data.payment.ClassType,
        segments: [
            {
                Time: formatToTime(new Date(data.payment.ReturnFlight?.DepartTime ?? "2025-12-25T00:00:00.0000Z")),
                Date: formatDateLocal(data.payment.ReturnFlight?.DepartTime ?? ""),
                Airport: (data.payment.ReturnFlight?.departureAirport.AirportID ?? ""),
                Place: (data.payment.ReturnFlight?.departureAirport.AirportName ?? "")
            }, {
                Time: formatToTime(new Date(data.payment.ReturnFlight?.ArrivalTime ?? "2025-12-25T00:00:00.0000Z")),
                Date: formatDateLocal(data.payment.ReturnFlight?.ArrivalTime ?? ""),
                Airport: (data.payment.ReturnFlight?.arrivalAirport.AirportID ?? ""),
                Place: (data.payment.ReturnFlight?.arrivalAirport.AirportName ?? "")
            }
        ]
    }

    const RoundTripFlights = [
        flightDetail,
        returnFlightDetail
    ];

    return (
        <div className="flex flex-col w-full justify-center gap-10 py-md">
            <h1 className="font-sarabun text-[2rem] font-bold leading-[120%] text-primary-600">
                Flight Order Summary
            </h1>

            <div className="flex items-start gap-16 self-stretch">
                <div className="flex flex-col items-start gap-[0.625rem] w-[35rem] p-[1rem]">
                    <div className="flex items-start self-stretch px-4 py-2 rounded-md bg-primary-50">
                        <div className="font-sarabun text-[1.2rem] font-semibold leading-[120%] text-primary-900 m-0">
                            Trip Type : {flightType}
                        </div>
                    </div>
                    
                    {(flightType === "Round Trip") && RoundTripFlights.map((flight, index) => (
                        <FlightDetailSummary
                            key={index}
                            flightLeg={flight.flightLeg}
                            departurePlace={flight.departurePlace ?? ""}
                            arrivalPlace={flight.arrivalPlace ?? ""}
                            airline={flight.airline ?? ""}
                            flightNumber={flight.flightNumber ?? ""}
                            cabinClass={flight.cabinClass}
                            segments={flight.segments}
                        />
                    ))}
                    {(flightType === "One Way") &&
                        <FlightDetailSummary
                            flightLeg={flightDetail.flightLeg}
                            departurePlace={flightDetail.departurePlace ?? ""}
                            arrivalPlace={flightDetail.arrivalPlace ?? ""}
                            airline={flightDetail.airline ?? ""}
                            flightNumber={flightDetail.flightNumber ?? ""}
                            cabinClass={flightDetail.cabinClass}
                            segments={flightDetail.segments}
                        />
                    }

                </div>

                <div className="flex items-start gap-[4rem] self-stretch">
                    {/* x-axis spacing */}
                </div>

                <div className="flex flex-col items-start gap-[1rem] [flex:1_0_0] bg-common-white p-[1rem]">
                    {passengers.map((p, idx) => (
                        <PassengerInfoSummary key={idx} count={idx + 1} {...p} />
                    ))}
                    <PriceBreakdownCard tickets={tickets} />
                    <PaymentDetailSummary bookingId={paymentDetail.bookingId} paymentMethod={paymentDetail.paymentMethod} />
                </div>
            </div>

            <div className="flex flex-col items-center self-stretch py-4">
                <Button
                    text="Done"
                    size="md"
                    width="w-[400px]"
                    align="center"
                    styleType="fill"
                    onClick={() => {
                        redirect('/flights/search');
                    }}
                />
            </div>

        </div>

    );
}