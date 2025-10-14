"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import BankSelect, { BankOption } from "./BankSelect";

interface PaymentMethodsProps {
    onStatusChange: (isValid: boolean) => void;
    onQRmethodChange: (isQR: boolean) => void;
}

export default function PaymentMethods({
    onStatusChange,
    onQRmethodChange,
}: PaymentMethodsProps) {
    const [selected, setSelected] = useState("mobile");
    const [bank, setBank] = useState("");

    useEffect(() => {
        onQRmethodChange(selected === "qr");
    }, [selected, onQRmethodChange]);

    useEffect(() => {
        let isValid = false;
        if (selected === "mobile") {
            isValid = bank !== "";
        } else if (selected === "qr") {
            isValid = true;
        }
        onStatusChange(isValid);
    }, [selected, bank, onStatusChange]);

    return (
        <div className="flex flex-col gap-[1.5rem] w-full">
            {/* Mobile Banking */}
            <label
                className={`flex flex-col gap-[1rem] border rounded-[0.5rem] px-[1rem] py-[0.75rem] cursor-pointer transition-all ${
                    selected === "mobile"
                        ? "border-[var(--color-gray-100)] border-[0.125rem] bg-white"
                        : "border-[var(--color-gray-100)] border-[0.125rem] bg-white"
                }`}
            >
                <div className="flex items-center gap-[1rem]">
                    <input
                        type="radio"
                        name="payment"
                        value="mobile"
                        checked={selected === "mobile"}
                        onChange={(e) => setSelected(e.target.value)}
                        className="w-[1.25rem] h-[1.25rem] accent-[var(--color-primary-500)]"
                    />
                    <span className="text-[1.125rem] font-semibold text-[var(--color-primary-900)]">
                        Mobile Banking
                    </span>
                </div>

                {/* Display Dropdown only when user selected Mobile Banking */}
                {selected === "mobile" && (
                    <BankSelect
                        value={bank}
                        onChange={(e) =>
                            setBank((e.target as HTMLInputElement).value)
                        }
                        placeholder="Select Bank"
                        renderSelected={(
                            selected: string,
                            options: BankOption[],
                        ) => {
                            const b = options.find((b) => b.value === selected);
                            if (!b) return selected;
                            return (
                                <div className="flex items-center gap-2">
                                    <img
                                        src={b.image}
                                        alt={b.label}
                                        width={36}
                                        height={36}
                                    />
                                    <span>{b.label}</span>
                                </div>
                            );
                        }}
                    />
                )}
            </label>

            {/* QR Payment */}
            <label
                className={`flex justify-between items-center border rounded-[0.5rem] px-[1rem] py-[0.75rem] cursor-pointer transition-all ${
                    selected === "qr"
                        ? "border-[var(--color-gray-100)] border-[0.125rem] bg-white"
                        : "border-[var(--color-gray-100)] border-[0.125rem] bg-white"
                }`}
            >
                <div className="flex items-center gap-[1rem]">
                    <input
                        type="radio"
                        name="payment"
                        value="qr"
                        checked={selected === "qr"}
                        onChange={(e) => setSelected(e.target.value)}
                        className="w-[1.25rem] h-[1.25rem] accent-[var(--color-primary-500)]"
                    />
                    <span className="text-[1.125rem] font-semibold text-[var(--color-primary-900)]">
                        QR Payment
                    </span>
                </div>
                <Image
                    src={"/payment/PromptPay.svg"}
                    alt="PromptPay"
                    width={74}
                    height={30}
                />
            </label>
        </div>
    );
}
