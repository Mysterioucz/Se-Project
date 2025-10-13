import Button from "@/src/components/Button";
import FlightDetailSummary from "@/src/components/paymentConfirmation/flightDetailSummary";
import PassengerInfoSummary from "@/src/components/paymentConfirmation/passengerInfoSummary";
import PaymentDetailSummary from "@/src/components/paymentConfirmation/paymentDetailSummary";
import PriceBreakdownCard from "@/src/components/paymentConfirmation/priceBreakdownCard";
import { PassengerTypes } from "@/src/enums/PassengerTypes";
import { PaymentMethodTypes } from "@/src/enums/PaymentMethodTypes";
import { FlightTypes } from "@/src/enums/FlightTypes";
import { FlightLegTypes } from "@/src/enums/FlightLegTypes";

export default function Page() {
    // Example flight data
    const flightType = FlightTypes.ROUND_TRIP;

    // Example ticket data
    const tickets = [
        { type: PassengerTypes.Adult, price: 1000, quantity: 1 },
        { type: PassengerTypes.Child, price: 700, quantity: 2 },
    ];

    // Example baggage data
    const baggage = {
        personal_item_price: 0,
        carry_on_item_price: 200,
        checked_baggage_price: 300,
    };

    // Example payment data
    const paymentDetail = {
        bookingId: "1763GUG6172",
        paymentMethod: PaymentMethodTypes.BankTransfer
    }

    // Example passenger data
    const passengers = [
        {
            GivenName: "John",
            LastName: "Doe",
            GenderOnID: "Male",
            Birthdate: "01/01/1990",
            Nationality: "American",
            SeatNo: "12A"
        },
        {
            GivenName: "Jane",
            LastName: "Smith",
            GenderOnID: "Female",
            Birthdate: "05/08/1998",
            Nationality: "Thai",
            SeatNo: "12B",
            PassportNo: "A12345678",
            PassportIssueDate: "01/01/2020",
            PassportExpiryDate: "01/01/2030"
        }
    ];

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

    return (
        <div className="flex flex-col w-full justify-center gap-10 py-md">
            <h1 className="font-sarabun text-[2rem] font-bold leading-[120%] text-primary-600">
                Flight Order Summary
            </h1>

            <div className="flex items-start gap-16 self-stretch">
                <div className="flex flex-col items-start gap-[0.625rem] w-[35rem] p-[1rem]">
                    <div className="flex items-start self-stretch px-4 py-2 rounded-md bg-primary-50">
                        <div className="font-sarabun text-[1.2rem] font-semibold leading-[120%] text-primary-900 m-0">
                            Type Trip : {flightType}
                        </div>
                    </div>
                    
                    <FlightDetailSummary
                        flightLeg={mockFlightDetail.flightLeg}
                        departurePlace={mockFlightDetail.departurePlace}
                        arrivalPlace={mockFlightDetail.arrivalPlace}
                        airline={mockFlightDetail.airline}
                        flightNumber={mockFlightDetail.flightNumber}
                        cabinClass={mockFlightDetail.cabinClass}
                        segments={mockFlightDetail.segments}
                    />

                </div>

                <div className="flex items-start gap-[4rem] self-stretch">
                    {/* x-axis spacing */}
                </div>

                <div className="flex flex-col items-start gap-[1rem] [flex:1_0_0] bg-common-white p-[1rem]">
                    {passengers.map((p, idx) => (
                        <PassengerInfoSummary key={idx} count={idx + 1} {...p} />
                    ))}
                    <PriceBreakdownCard tickets={tickets} baggage={baggage} />
                    <PaymentDetailSummary bookingId={paymentDetail.bookingId} paymentMethod={paymentDetail.paymentMethod}/>
                </div>
            </div>

            <div className="flex flex-col items-center self-stretch py-4">
                <Button
                    text="Done"
                    size="md"
                    width="w-[400px]"
                    align="center"
                    styleType="fill"
                />
            </div>

        </div>

    );
}
