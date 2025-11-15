"use client";

import { PassengerTypes } from "@/src/enums/PassengerTypes";
import { useEffect, useState } from "react";

export interface TicketSummaryProps {
    type: PassengerTypes;
    price: number; // price per ticket
    quantity: number;
}

export interface BaggageSummaryProps {
    personal_item_price: number;
    carry_on_item_price: number;
    checked_baggage_price: number;
    services_fee: number;
}

function TicketSummary({ type, price, quantity }: TicketSummaryProps) {
    return (
        <div className="grid h-[1.75rem] grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] gap-x-[1rem] gap-y-[0.5rem] self-stretch pl-[0.75rem]">
            {/* Passenger Type */}
            <div className="font-sarabun col-span-1 col-start-1 row-span-1 row-start-1 text-[0.875rem] leading-[120%] font-normal text-gray-500">
                {type}
            </div>

            {/* Price and Count */}
            <div className="col-span-1 col-start-2 row-span-1 row-start-1 grid h-[1.75rem] w-[7.25rem] flex-shrink-0 grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] gap-y-[0.5rem] justify-self-end">
                <div className="font-sarabun col-span-1 col-start-1 row-span-1 row-start-1 justify-self-end text-right text-[0.875rem] leading-[120%] font-normal whitespace-nowrap text-gray-500">
                    ฿ {price.toFixed(2)}
                </div>

                <div className="font-sarabun col-span-1 col-start-2 row-span-1 row-start-1 justify-self-end text-right text-[0.875rem] leading-[120%] font-normal text-gray-500">
                    x {quantity}
                </div>
            </div>
        </div>
    );
}

function BaggageSummary({
    personal_item_price,
    carry_on_item_price,
    checked_baggage_price,
}: BaggageSummaryProps) {
    const formatPrice = (price: number) =>
        price === 0 ? "Free" : `฿ ${price.toFixed(2)}`;

    return (
        <div className="grid h-fit grid-cols-2 grid-rows-3 gap-x-8 gap-y-2 self-stretch pl-3">
            <div className="font-sarabun col-span-1 col-start-1 row-span-1 row-start-1 text-sm leading-[1.2] font-normal text-gray-500">
                Personal Item
            </div>
            <div className="font-sarabun col-span-1 col-start-2 row-span-1 row-start-1 justify-self-end text-right text-sm leading-[1.2] font-normal text-gray-500">
                {formatPrice(personal_item_price)}
            </div>
            <div className="font-sarabun col-span-1 col-start-1 row-span-1 row-start-2 text-sm leading-[1.2] font-normal text-gray-500">
                Carry-on Baggage
            </div>
            <div className="font-sarabun col-span-1 col-start-2 row-span-1 row-start-2 justify-self-end text-right text-sm leading-[1.2] font-normal text-gray-500">
                {formatPrice(carry_on_item_price)}
            </div>
            <div className="font-sarabun col-span-1 col-start-1 row-span-1 row-start-3 text-sm leading-[1.2] font-normal text-gray-500">
                Checked Baggage
            </div>
            <div className="font-sarabun col-span-1 col-start-2 row-span-1 row-start-3 justify-self-end text-right text-sm leading-[1.2] font-normal text-gray-500">
                ฿ {checked_baggage_price.toFixed(2)}
            </div>
        </div>
    );
}

interface PriceBreakdownCardProps {
    tickets: TicketSummaryProps[];
    servicesFee?: number;
}

export default function PriceBreakdownCard({
    tickets,
    servicesFee = 0,
}: PriceBreakdownCardProps) {
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [totalBaggagePrice, setTotalBaggagePrice] = useState<number>(0);

    useEffect(() => {
        // Calculate total ticket price
        const ticketTotal = tickets.reduce(
            (sum, t) => sum + t.price * t.quantity,
            0,
        );

        // Calculate total baggage price
        const baggageTotal = servicesFee;
        setTotalBaggagePrice(servicesFee);
        setTotalPrice(ticketTotal + baggageTotal);
    }, [tickets, servicesFee]);

    return (
        <div className="border-primary-300 flex flex-col items-start gap-[1rem] self-stretch rounded-[0.5rem] border-[0.125rem] bg-white p-[1rem_1.5rem]">
            {/* Price Breakdown */}
            <div className="flex flex-col items-start gap-[1.5rem] self-stretch">
                {/* Header */}
                <div className="text-primary-900 font-sarabun self-stretch text-[1.5rem] leading-[1.2] font-semibold">
                    Price Breakdown
                </div>

                {/* Content */}
                <div className="flex flex-col items-start gap-[1.5rem] self-stretch">
                    {/* Tickets */}
                    <div className="flex flex-col items-start gap-[1rem] self-stretch">
                        <div className="text-primary-700 font-sarabun self-stretch text-[1.125rem] leading-[1.2] font-semibold">
                            Tickets
                        </div>

                        {/* Ticket Summary Components */}
                        <div className="flex flex-col space-y-[0.5rem] self-stretch">
                            {tickets.map((ticket, index) => {
                                if (ticket.quantity > 0) {
                                    return (
                                        <TicketSummary
                                            key={index}
                                            type={ticket.type}
                                            price={ticket.price}
                                            quantity={ticket.quantity}
                                        />
                                    );
                                }
                                return;
                            })}
                        </div>
                    </div>

                    {/* Baggage */}
                    <div className="flex flex-col items-start gap-[1rem] self-stretch">
                        <div className="text-primary-700 font-sarabun self-stretch text-[1.125rem] leading-[1.2] font-semibold">
                            Baggage
                        </div>

                        {/* Baggage Summary Components */}
                        <BaggageSummary
                            personal_item_price={0}
                            carry_on_item_price={0}
                            checked_baggage_price={totalBaggagePrice}
                            services_fee={servicesFee}
                        />
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="bg-primary-300 h-[0.125rem] self-stretch"></div>

            {/* Price Summary */}
            <div className="flex items-center justify-between self-stretch">
                <div className="text-primary-700 font-sarabun text-[1.25rem] leading-[1.2] font-semibold">
                    Total
                </div>

                <div className="text-primary-600 font-sarabun text-[1.125rem] leading-[1.2] font-semibold">
                    ฿ {totalPrice.toFixed(2)}
                </div>
            </div>
        </div>
    );
}
