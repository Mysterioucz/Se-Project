"use client";
import { TelArray } from "@data/mockTelPrefix";
import { useEffect, useRef, useState } from "react";
import SmallArrowDown from "../icons/fi-sr-angle-small-down.svg";
import ListChoice from "../list_choice";
interface Props {
    value: string;
    onChange?: (event: React.ChangeEvent<{ value: string }>) => void;
    disabled?: boolean;
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
                <ListChoice
                    options={TelArray}
                    onClick={() => setIsOpen(false)}
                    onChange={onChange}
                />
            )}
        </div>
    );
}
