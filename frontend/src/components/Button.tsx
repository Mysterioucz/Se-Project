"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';

type ButtonStyle = "fill" | "stroke" | "text" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
    text: string;
    iconStart?: string;
    iconEnd?: string;
    onClick?: () => void;
    disabled?: boolean;
    styleType?: ButtonStyle;  // fill, stroke, text
    size?: ButtonSize;        // sm, md, lg
    width?: string;
    height?: string;
    href?: string;
}

export default function Button({
    text,
    iconStart,
    iconEnd,
    onClick=() => {},
    disabled = false,
    styleType = "fill",
    size = "md",
    width = "w-fit",
    height = "h-full",
    href,
}: ButtonProps) {
    const [clicked, setClicked] = useState(false);
    
    const router = useRouter();

    const handleClick = () => {
        if (!disabled) {
            setClicked(!clicked); // toggle สี
            onClick();
        }
    };

const sizeClasses: Record<ButtonSize, string> = {
    sm: "py-2 px-2 text-[0.875rem]",
    md: "py-2 px-4 text-[1rem]",
    lg: "py-4 px-6 text-[1.125rem]",
};

const styleClasses: Record<ButtonStyle, string> = {
    fill: `
      ${clicked ? "border-2 border-primary-300 bg-primary-300 text-white" : "border-2 border-primary-400 bg-primary-400 text-white"}
      hover:bg-primary-600
    `,
    stroke: `
      ${clicked ? "border-2 border-primary-300 text-primary-300" : "border-2 border-primary-400 text-primary-400"}
      bg-white
      hover:border-primary-600 hover:text-primary-600
    `,
    text: `
      ${clicked ? "text-primary-300" : "text-primary-400"}
      bg-transparent
      hover:text-primary-600
    `,
    danger: `
      ${clicked ? "border-2 border-error-main bg-white text-error-main" : "border-2 border-error-main bg-white text-error-main"}
      hover:bg-error-lighter
    `,
};

return (
    <button
        onClick={handleClick}
        disabled={disabled}
        className={`
        flex items-center justify-center gap-4
        ${width} ${height} rounded-md
        transition-colors duration-200
        ${sizeClasses[size]}
        ${styleClasses[styleType]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
        {
            iconStart
            &&
            <Image
                src={iconStart}
                alt="Icon start"
                width={20}
                height={20}
                className="w-[1.25rem] h-[1.25rem]" />
        }
        <span className="text-inherit">{text}</span>
        {
            iconEnd
            &&
            <Image
                src={iconEnd}
                alt="Icon end"
                width={20}
                height={20}
                className="w-[1.25rem] h-[1.25rem]" />
        }
    </button>
);
}