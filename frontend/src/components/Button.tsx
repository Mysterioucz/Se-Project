"use client";

import React, { useState } from "react";
import { ButtonStyle, ButtonSize, ButtonProps } from "./Helper";

export default function Button({
    text,
    iconStart,
    iconEnd,
    onClick,
    disabled = false,
    styleType = "fill",
    size = "md",
    href, // Navigate to 'href' page
}: ButtonProps) {
    const [clicked, setClicked] = useState(false);

    const handleClick = () => {
        if (!disabled) {
            setClicked(!clicked); // toggle สี
            onClick?.();
            if (href) {
                setTimeout(() => {
                    window.location.href = href; // ไปยังลิงก์ที่รับมา
                }, 100); // ให้ React render ก่อน
            }
        }
    };

    const sizeClasses: Record<ButtonSize, string> = {
        sm: "py-[var(--spacing-sm)] px-[var(--spacing-sm)] text-[var(--text-body-sm)]",
        md: "py-[var(--spacing-sm)] px-[var(--spacing-md)] text-[var(--text-body)]",
        lg: "py-[var(--spacing-md)] px-[var(--spacing-lg)] text-[var(--text-body-lg)]",
    };

    const styleClasses: Record<ButtonStyle, string> = {
        fill: `
      ${clicked ? "bg-[var(--color-primary-300)] text-[var(--color-common-white)]" : "bg-[var(--color-primary-400)] text-[var(--color-common-white)]"}
      hover:bg-[var(--color-primary-600)]
    `,
        stroke: `
      ${clicked ? "border-2 border-[var(--color-primary-300)] text-[var(--color-primary-300)]" : "border-2 border-[var(--color-primary-400)] text-[var(--color-primary-400)]"}
      bg-[var(--color-common-white)]
      hover:border-[var(--color-primary-600)] hover:text-[var(--color-primary-600)]
    `,
        text: `
      ${clicked ? "text-[var(--color-primary-300)]" : "text-[var(--color-primary-400)]"}
      bg-transparent 
      hover:text-[var(--color-primary-600)]
    `,
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={`
        flex items-center gap-[var(--spacing-md)]
        w-fit h-full rounded-[var(--radius-md)]
        transition-colors duration-200
        ${sizeClasses[size]}
        ${styleClasses[styleType]}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
        >
            {iconStart && <img src={iconStart} alt="" className="w-[1.25rem] h-[1.25rem]" />}
            <span className="text-inherit">{text}</span>
            {iconEnd && <img src={iconEnd} alt="" className="w-[1.25rem] h-[1.25rem]" />}
        </button>
    );
}