"use client";
import { MenuItem, Select } from "@mui/material";
import type { ReactNode } from "react";
import React from "react";

export type SelectEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<{ value: unknown }>
    | (Event & { target: { value: string; name?: string } });

interface Props {
    labelId: string;
    id: string;
    value: string;
    error?: boolean;
    disabled?: boolean;
    maxChildrenHeight?: number;
    width?: string;
    height?: string;
    onChange?: (event: SelectEvent, child?: React.ReactNode) => void;
    children?: React.ReactNode;
    placeholder?: string;
    bgColor?: string;
    renderSelected?: (selected: string) => ReactNode;
}

export default function SelectComponent({
    labelId,
    id,
    value,
    error,
    disabled,
    maxChildrenHeight = 256,
    onChange,
    children,
    placeholder = "Select an option",
    renderSelected,
    width = "w-full",
    height,
    bgColor = "bg-white",
}: Props) {
    function resolveTextColor() {
        if (disabled) return "text-disabled-dark";
        return "text-gray-400 focus-within:text-primary-900";
    }

    return (
        <Select
            error={error}
            disabled={disabled}
            displayEmpty
            className={`group ${resolveTextColor()} ${width} ${height} ${bgColor}`}
            slotProps={{
                notchedOutline: {
                    className: `border-2 border-gray-200 ${
                        disabled ? "" : "group-hover:border-gray-400"
                    } group-[.Mui-focused]:border-primary-600 group-[.Mui-error]:border-error-main`,
                },
            }}
            labelId={labelId}
            id={id}
            value={value}
            onChange={onChange}
            MenuProps={{
                PaperProps: {
                    sx: {
                        maxHeight: maxChildrenHeight,
                        zIndex: 10001,
                    },
                },
                disablePortal: true,
            }}
            renderValue={(selected) => {
                if (!selected)
                    return <span className="text-gray-400">{placeholder}</span>;
                if (renderSelected) return renderSelected(selected);
                return selected;
            }}
        >
            <MenuItem value="" disabled>
                <em>{placeholder}</em>
            </MenuItem>
            {children}
        </Select>
    );
}
