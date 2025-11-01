"use client";
import { ChangeEvent } from 'react';

interface TextAreaProps {
    label: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    containerClassName?: string;
    // --- 1. เพิ่ม Props สำหรับ Error State ---
    error?: boolean;
    helperText?: string;
}

export default function TextAreaComponent({
    label,
    value,
    onChange,
    placeholder,
    rows = 5,
    containerClassName = "",
    error = false, // 2. รับค่า error
    helperText,  // 2. รับค่า helperText
}: TextAreaProps) {
    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            <label className="font-semibold text-gray-700 text-lg">{label}</label>
            <textarea
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                // 3. เปลี่ยนสีขอบและ focus เมื่อเกิด error
                className={`w-full p-3 rounded-md border-2 
                    ${error 
                        ? 'border-error-main focus:border-error-main' 
                        : 'border-gray-200 focus:border-primary-600'
                    } 
                    focus:ring-1 focus:ring-primary-600 outline-none text-lg`}
            />
            {/* 4. แสดงข้อความ Error (ถ้ามี) */}
            {helperText && (
                <p className={`text-sm ${error ? 'text-error-main' : 'text-gray-500'}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
}