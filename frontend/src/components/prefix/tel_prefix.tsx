"use client";
import { TelArray } from "@/data/mockTelPrefix";
import SmallArrowDown from "../icons/fi-sr-angle-small-down.svg";
import { useEffect, useRef, useState } from "react";
interface Props {
    value: string;
    onChange?: (event: React.ChangeEvent<{ value: unknown }>) => void;
    disabled?: boolean;
}

function OptionContainer({
    value,
    onClick,
}: {
    value: string;
    onClick: () => void;
}) {
    return (
        <div className="p-2 cursor-pointer" onClick={onClick}>
            {value}
        </div>
    );
}

export default function TelPrefix({ value, onChange, disabled }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="flex relative text-inl" ref={ref}>
            <button
                className={`flex ${
                    disabled ? "" : "cursor-pointer"
                } items-center`}
                onClick={() => setIsOpen(!isOpen && !disabled)}
            >
                <p
                    className={`whitespace-nowrap ${
                        disabled ? "text-gray-400" : ""
                    }`}
                >
                    {value}
                </p>
                <SmallArrowDown />
            </button>
            {isOpen && (
                <div className="flex w-fit shadow-lg/20 p-1 max-h-[12.5rem] top-[100%] bg-common-white flex-col absolute z-10 overflow-y-auto overflow-x-clip">
                    {TelArray.map((tel, index) => (
                        <OptionContainer
                            key={index}
                            value={tel}
                            onClick={() => {
                                setIsOpen(false);
                                onChange &&
                                    onChange({
                                        target: { value: tel },
                                    } as React.ChangeEvent<{ value: unknown }>);
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
