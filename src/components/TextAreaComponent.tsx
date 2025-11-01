"use client";
import { ChangeEvent } from 'react';

interface TextAreaProps {
    label: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    containerClassName?: string;
}

export default function TextAreaComponent({
    label,
    value,
    onChange,
    placeholder,
    rows = 5,
    containerClassName = ""
}: TextAreaProps) {
    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            <label className="font-semibold text-gray-700 text-lg">{label}</label>
            <textarea
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-3 rounded-md border-2 border-gray-200 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none text-lg"
            />
        </div>
    );
}