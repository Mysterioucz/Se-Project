"use client";
export interface PriceCabinClassProps {
    price: number;
    cabinClass: string;
    onClick: () => void;
}

function PriceCabinClass({ price, cabinClass, onClick }: PriceCabinClassProps) {
    return (
        <div className="flex flex-col pl-8 pr-8 items-center justify-center gap-3">
            <h2 className="text-primary-600">{price.toString() + " Baht"}</h2>
            <p className="text-primary-600">{cabinClass}</p>
            {/* TODO: Replace button with Button Component */}
            <button onClick={onClick}>Select</button>
        </div>
    );
}

export default PriceCabinClass;
