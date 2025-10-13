import { PassengerTypes } from "@/src/enums/PassengerTypes";

interface TicketSummaryProps {
    type: PassengerTypes;
    price: number;   // price per ticket
    quantity: number;
}

function TicketSummary({ type, price, quantity }: TicketSummaryProps) {
    return (
        <div className="grid h-[1.75rem] pl-[0.75rem] gap-x-[1rem] gap-y-[0.5rem] self-stretch grid-rows-[repeat(1,minmax(0,1fr))] grid-cols-[repeat(2,minmax(0,1fr))]">
            {/* Passenger Type */}
            <div className="row-start-1 row-span-1 col-start-1 col-span-1 text-gray-500 font-sarabun text-[0.875rem] font-normal leading-[120%]">
                {type}
            </div>

            {/* Price and Count */}
            <div className="grid w-[7.25rem] h-[1.75rem] gap-y-[0.5rem] flex-shrink-0 row-start-1 row-span-1 col-start-2 col-span-1 justify-self-end grid-rows-[repeat(1,minmax(0,1fr))] grid-cols-[repeat(2,minmax(0,1fr))]">
                <div className="row-start-1 row-span-1 col-start-1 col-span-1 justify-self-end text-gray-500 text-right font-sarabun text-[0.875rem] font-normal leading-[120%] whitespace-nowrap">
                    ฿ {price}
                </div>

                <div className="row-start-1 row-span-1 col-start-2 col-span-1 justify-self-end text-gray-500 text-right font-sarabun text-[0.875rem] font-normal leading-[120%]">
                    x {quantity}
                </div>
            </div>
        </div>
    );
}

function BaggageSummary() {
    return (
        <div className="flex flex-col items-start gap-[0.5rem] self-stretch">
            {/* Replace with your baggage items */}
            <div className="text-primary-600 font-sarabun text-[1rem]">20kg x1</div>
            <div className="text-primary-600 font-sarabun text-[1rem]">15kg x1</div>
        </div>
    );
}

export default function PriceBreakdownCard() {
    return (
        <div className="flex flex-col items-start self-stretch gap-[1rem] p-[1rem_1.5rem] rounded-[0.5rem] border-[0.125rem] border-primary-300 bg-white">
            {/* Price Breakdown */}
            <div className="flex flex-col items-start gap-[1.5rem] self-stretch">
                {/* Header */}
                <div className="self-stretch text-primary-900 font-sarabun text-[1.5rem] font-semibold leading-[1.2]">
                    Price Breakdown
                </div>

                {/* Content */}
                <div className="flex flex-col items-start gap-[1.5rem] self-stretch">
                    {/* Tickets */}
                    <div className="flex flex-col items-start gap-[1rem] self-stretch">
                        <div className="self-stretch text-primary-700 font-sarabun text-[1.125rem] font-semibold leading-[1.2]">
                            Tickets
                        </div>

                        {/* Ticket Summary Components */}
                        <TicketSummary type={PassengerTypes.Adult} price={1000.00} quantity={1}/>
                    </div>


                    {/* Baggage */}
                    <div className="flex flex-col items-start gap-[1rem] self-stretch">
                        <div className="self-stretch text-primary-700 font-sarabun text-[1.125rem] font-semibold leading-[1.2]">
                            Baggage
                        </div>

                        {/* Baggage Summary Components */}

                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-[0.125rem] self-stretch bg-primary-300"></div>

            {/* Price Summary */}
            <div className="flex justify-between items-center self-stretch">
                <div className="text-primary-700 font-sarabun text-[1.25rem] font-semibold leading-[1.2]">
                    Total
                </div>

                <div className="text-primary-600 font-sarabun text-[1.125rem] font-semibold leading-[1.2]">
                    ฿ 1,000.00
                </div>
            </div>
        </div>
    );
}