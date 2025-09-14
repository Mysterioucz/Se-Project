"use client";

import Button from "../Button";

export interface PriceCabinClassProps {
    price: number;
    cabinClass: string;
    onClick?: () => void;
}

function PriceCabinClass({ price, cabinClass, onClick }: PriceCabinClassProps) {
    return (
        <div className="flex flex-col w-full min-w-[12.5rem] pl-8 pr-8 items-center justify-center gap-3">
            <h2 className="text-primary-600">{"฿ " + price.toString()}</h2>
            <p className="text-primary-600">{cabinClass}</p>
            <Button onClick={onClick} width="full" height="h-fit" text="Select" />
        </div>
    );
}

export default PriceCabinClass;
