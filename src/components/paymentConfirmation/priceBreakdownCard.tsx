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
                    ฿ {price.toFixed(2)}
                </div>

                <div className="row-start-1 row-span-1 col-start-2 col-span-1 justify-self-end text-gray-500 text-right font-sarabun text-[0.875rem] font-normal leading-[120%]">
                    x {quantity}
                </div>
            </div>
        </div>
    );
}

interface BaggageSummaryProps {
    personal_item_price: number;
    carry_on_item_price: number;
    checked_baggage_price: number;
}

function BaggageSummary({personal_item_price, carry_on_item_price, checked_baggage_price}: BaggageSummaryProps) {
    const formatPrice = (price: number) => (price === 0 ? "Free" : `฿ ${price.toFixed(2)}`);
    
    return (
        <div className="grid h-[5.688rem] pl-3 gap-y-2 gap-x-8 self-stretch grid-rows-3 grid-cols-2">
            <div className="text-gray-500 font-sarabun text-sm font-normal leading-[1.2] row-start-1 row-span-1 col-start-1 col-span-1">
                Personal Item
            </div>
            <div className="row-start-1 row-span-1 col-start-2 col-span-1 justify-self-end text-gray-500 text-right font-sarabun text-sm font-normal leading-[1.2]">
                {formatPrice(personal_item_price)}
            </div>
            <div className="text-gray-500 font-sarabun text-sm font-normal leading-[1.2] row-start-2 row-span-1 col-start-1 col-span-1">
                Carry-on Baggage
            </div>
            <div className="row-start-2 row-span-1 col-start-2 col-span-1 justify-self-end text-gray-500 text-right font-sarabun text-sm font-normal leading-[1.2]">
                {formatPrice(carry_on_item_price)}
            </div>
            <div className="text-gray-500 font-sarabun text-sm font-normal leading-[1.2] row-start-3 row-span-1 col-start-1 col-span-1">
                Checked Baggage
            </div>
            <div className="row-start-3 row-span-1 col-start-2 col-span-1 justify-self-end text-gray-500 text-right font-sarabun text-sm font-normal leading-[1.2]">
                ฿ {checked_baggage_price.toFixed(2)}
            </div>
        </div>
    );
}

interface PriceBreakdownCardProps {
    tickets: TicketSummaryProps[];
    baggage: BaggageSummaryProps;
}

export default function PriceBreakdownCard({ tickets, baggage }: PriceBreakdownCardProps) {
    const totalPrice = tickets.reduce((sum, t) => sum + t.price * t.quantity, 0) + baggage.personal_item_price + baggage.carry_on_item_price + baggage.checked_baggage_price;

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
                        <div className="flex flex-col self-stretch space-y-[0.5rem]">
                            {tickets.map((t, idx) => (
                                <TicketSummary key={idx} {...t} />
                            ))}
                        </div>
                    </div>

                    {/* Baggage */}
                    <div className="flex flex-col items-start gap-[1rem] self-stretch">
                        <div className="self-stretch text-primary-700 font-sarabun text-[1.125rem] font-semibold leading-[1.2]">
                            Baggage
                        </div>

                        {/* Baggage Summary Components */}
                        <BaggageSummary {...baggage} />
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
                    ฿ {totalPrice.toFixed(2)}
                </div>
            </div>
        </div>
    );
}