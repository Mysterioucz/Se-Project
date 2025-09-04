'use client'
import { useState } from "react";

export default function QuantitySelector({label, description, init}:{label:string, description:string, init:number}) {
    const [count, setCount] = useState(init);

    const handleDecrement = () => {
        setCount(Math.max(0,count - 1));
    };

    const handleIncrement = () => {
        setCount(count + 1);
    };
    
    return (
        <div className="flex items-center justify-between py-2">
            <div className="flex flex-col ml-3 py-1">
                <p className="text-md text-primary-900">{label}</p>
                <p className="text-sm text-gray-300">{description}</p>
            </div>
            <div className="flex items-center space-x-2 mr-3">
                <button
                    onClick={handleDecrement}
                    className="text-lg font-light text-gray-400 hover:text-gray-600 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Decrement ${label}`}
                    disabled={count === 0}
                >
                    &minus;
                </button>
                <span className="text-lg text-gray-800 text-center">{count}</span>
                <button
                    onClick={handleIncrement}
                    className="text-lg font-light text-cyan-500 hover:text-cyan-700 focus:outline-none transition-colors"
                    aria-label={`Increment ${label}`}
                >+</button>
            </div>
        </div>
    );
}