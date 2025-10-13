"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type ButtonStyle = "fill" | "stroke" | "text" |  "red-critical";;
type ButtonSize = "sm" | "md" | "lg";
type ButtonAlign = "left" | "center" | "right";

interface ButtonProps {
  text: string;
  iconStart?: string;
  iconEnd?: string;
  onClick?: () => void;
  disabled?: boolean;
  styleType?: ButtonStyle;
  size?: ButtonSize;
  width?: string;
  height?: string;
  href?: string;
  align?: ButtonAlign;
}

export default function Button({
  text,
  iconStart,
  iconEnd,
  onClick = () => {},
  disabled = false,
  styleType = "fill",
  size = "md",
  width = "w-fit",
  height = "h-full",
  href,
  align = "center",
}: ButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (!disabled) {
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
      border-2 border-primary-400 bg-primary-400 text-white
      hover:bg-primary-600
      disabled:bg-[var(--color-disable-light)] disabled:text-[var(--color-disable-dark)] disabled:border-transparent
    `,
    stroke: `
      border-2 border-primary-400 text-primary-400 bg-white
      hover:border-primary-600 hover:text-primary-600
      disabled:border-[var(--color-disable-dark)] disabled:text-[var(--color-disable-dark)] disabled:bg-[var(--color-disable-lighter)]
    `,
    text: `
      text-primary-400 bg-transparent
      hover:text-primary-600
      disabled:text-[var(--color-disable-dark)]
    `,
    "red-critical": `
      rounded-[var(--Radius-md,0.5rem)]
      border-solid border-[0.125rem] border-[var(--color-error-main,#C53737)]
      bg-[var(--Common-white,#FFF)] text-[var(--color-error-main,#C53737)]
      hover:bg-[var(--color-error-main,#C53737)] hover:text-white
      disabled:bg-[var(--color-disable-light)] disabled:text-[var(--color-disable-dark)] disabled:border-[var(--color-disable-dark)]
    `,
  };

  const alignClasses: Record<ButtonAlign, string> = {
    left: "justify-start pl-[var(--Spacing-md,16px)] pr-[var(--Spacing-sm,8px)]",
    center: "justify-center px-[var(--Spacing-md,16px)]",
    right: "justify-end pr-[var(--Spacing-md,16px)] pl-[var(--Spacing-sm,8px)]",
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        flex items-center ${alignClasses[align]}
        ${width} ${height} rounded-md
        transition-colors duration-200
        cursor-pointer
        disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${styleClasses[styleType]}
        gap-[var(--Spacing-md,16px)]
        py-[var(--Spacing-sm,8px)]
      `}
    >
      {iconStart && (
        <Image
          src={iconStart}
          alt="Icon start"
          width={20}
          height={20}
          className="w-[1.25rem] h-[1.25rem]"
        />
      )}
      <span className="text-inherit">{text}</span>
      {iconEnd && (
        <Image
          src={iconEnd}
          alt="Icon end"
          width={20}
          height={20}
          className="w-[1.25rem] h-[1.25rem]"
        />
      )}
    </button>
  );
}