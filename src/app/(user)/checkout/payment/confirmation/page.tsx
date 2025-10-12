import Button from "@/src/components/Button";
import FlightDetailSummary from "@/src/components/paymentConfirmation/flightDetailSummary";
import PassengerInfoSummary from "@/src/components/paymentConfirmation/passengerInfoSummary";
export default function Page() {
  return (

    <div className="flex flex-col w-full justify-center gap-10">
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
            </div>

            <div className="flex items-start gap-[4rem] self-stretch">
                {/* x-axis spacing */}
            </div>

            <div className="flex flex-col items-start gap-[1rem] [flex:1_0_0] bg-common-white p-[1rem]">
                <PassengerInfoSummary />
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
