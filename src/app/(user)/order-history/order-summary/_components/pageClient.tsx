"use client"
import Button from "@/src/components/Button";
import FlightDetailSummary from "@/src/app/(user)/order-history/order-summary/_components/flightDetailSummary";
import PassengerInfoSummary from "@/src/app/(user)/order-history/order-summary/_components/passengerInfoSummary";
import PaymentDetailSummary from "@/src/app/(user)/order-history/order-summary/_components/paymentDetailSummary";
import PriceBreakdownCard from "@/src/app/(user)/order-history/order-summary/_components/priceBreakdownCard";
import { FlightLegTypes } from "@/src/enums/FlightLegTypes";
import { PassengerTypes } from "@/src/enums/PassengerTypes";
import { PaymentMethodTypes } from "@/src/enums/PaymentMethodTypes";
import { redirect } from "next/navigation";
import { Router, useRouter } from "next/router";
import formatDateLocal from "@/src/lib/formatDateLocal";

export interface Airport {
    AirportCode: string;
    AirportName: string;
    City: string;
    Country: string;
}

export interface Flight {
    FlightNo: string;
    DepartTime: string;      // ISO string from Date
    ArrivalTime: string;     // ISO string from Date
    Airline: string;
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

    const mockFlightDetail = {
        flightLeg: FlightLegTypes.DEPARTURE,
        departurePlace: "Bangkok",
        arrivalPlace: "London",
        airline: "Thai Airways",
        flightNumber: "TG910",
        cabinClass: "Business",
        segments: [
            {
                Time: "08:30",
                Date: "2025-11-01",
                Airport: "BKK",
                Place: "Bangkok Suvarnabhumi Airport"
            },
            {
                Time: "14:00",
                Date: "2025-11-01",
                Airport: "DXB",
                Place: "Dubai International Airport"
            },
            {
                Time: "16:00",
                Date: "2025-11-01",
                Airport: "DXB",
                Place: "Dubai International Airport"
            },
            {
                Time: "20:30",
                Date: "2025-11-01",
                Airport: "LHR",
                Place: "London Heathrow Airport"
            }
        ]
    };

    const mockReturnFlightDetail = {
        flightLeg: FlightLegTypes.RETURN,
        departurePlace: "London",
        arrivalPlace: "Bangkok",
        airline: "Thai Airways",
        flightNumber: "TG911",
        cabinClass: "Business",
        segments: [
            {
                Time: "10:00",
                Date: "2025-11-10",
                Airport: "LHR",
                Place: "London Heathrow Airport"
            },
            {
                Time: "14:30",
                Date: "2025-11-10",
                Airport: "DXB",
                Place: "Dubai International Airport"
            },
            {
                Time: "16:30",
                Date: "2025-11-10",
                Airport: "DXB",
                Place: "Dubai International Airport"
            },
            {
                Time: "06:00",
                Date: "2025-11-11",
                Airport: "BKK",
                Place: "Bangkok Suvarnabhumi Airport"
            }
        ]
    };

    const mockRoundTripFlights = [
        mockFlightDetail,
        mockReturnFlightDetail
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
                    
                    {mockRoundTripFlights.map((flight, index) => (
                        <FlightDetailSummary
                            key={index}
                            flightLeg={flight.flightLeg}
                            departurePlace={flight.departurePlace}
                            arrivalPlace={flight.arrivalPlace}
                            airline={flight.airline}
                            flightNumber={flight.flightNumber}
                            cabinClass={flight.cabinClass}
                            segments={flight.segments}
                        />
                    ))}

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