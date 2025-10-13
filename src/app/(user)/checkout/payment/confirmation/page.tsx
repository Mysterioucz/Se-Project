import Button from "@/src/components/Button";
import FlightDetailSummary from "@/src/components/paymentConfirmation/flightDetailSummary";
import PassengerInfoSummary from "@/src/components/paymentConfirmation/passengerInfoSummary";
import PaymentDetailSummary from "@/src/components/paymentConfirmation/paymentDetailSummary";
import PriceBreakdownCard from "@/src/components/paymentConfirmation/priceBreakdownCard";
import { PassengerTypes } from "@/src/enums/PassengerTypes";
import { PaymentMethodTypes } from "@/src/enums/PaymentMethodTypes";

export default function Page() {
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

    const paymentDetail = {
        bookingId: "1763GUG6172",
        paymentMethod: PaymentMethodTypes.BankTransfer
    }

    return (
        <div className="flex flex-col w-full justify-center gap-10 py-md">
            <h1 className="font-sarabun text-[2rem] font-bold leading-[120%] text-primary-600">
                Flight Order Summary
            </h1>

            <div className="flex items-start gap-16 self-stretch">
                <div className="flex flex-col items-start gap-[0.625rem] w-[35rem] p-[1rem]">
                    <div className="flex items-start self-stretch px-4 py-2 rounded-md bg-primary-50">
                        <div className="font-sarabun text-[1.2rem] font-semibold leading-[120%] text-primary-900 m-0">
                            Type Trip : One-Way
                        </div>
                    </div>
                    {/* for dev */}
                    <FlightDetailSummary />
                    <FlightDetailSummary />
                </div>

                <div className="flex items-start gap-[4rem] self-stretch">
                    {/* x-axis spacing */}
                </div>

                <div className="flex flex-col items-start gap-[1rem] [flex:1_0_0] bg-common-white p-[1rem]">
                    <PassengerInfoSummary />
                    <PassengerInfoSummary />
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
