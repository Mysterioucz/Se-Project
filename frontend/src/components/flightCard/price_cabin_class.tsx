export interface PriceCabinClassProps {
    price: number;
    cabinClass: string;
    onClick: () => void;
}

function PriceCabinClass({ price, cabinClass, onClick }: PriceCabinClassProps) {
    return (
        <div className="flex flex-col pl-8 pr-8 items-center justify-between">
            <h2 className="text-primary-600">{cabinClass}</h2>
            <p className="text-primary-600">{price}</p>
            {/* TODO: Replace button with Button Component */}
            <button onClick={onClick} />
        </div>
    );
}

export default PriceCabinClass;