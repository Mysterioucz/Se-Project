"use client";
import { Select } from "@mui/material";


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

    onChange?: (
        event: SelectEvent,
        child?: React.ReactNode
    ) => void;
    children?: React.ReactNode;
}

export default function SelectComponent({
    labelId,
    id,
    value,
    error,
    disabled,
    maxChildrenHeight = "max-h-[16rem]",
    onChange,
    children,
}: Props) {
    function resolveTextColor() {
        if (disabled) return "text-disabled-dark";
        return "text-gray-400 focus-within:text-primary-900";
    }

    return (
        <Select
            error={error}
            disabled={disabled}
            // need to add group className at Parent element to let tailwind overwrite the default styles of child element
            className={`group ${resolveTextColor()}`}
            slotProps={{
                notchedOutline: {
                    className: `border-2 border-gray-200 ${
                        disabled ? "" : "group-hover:border-gray-400"
                    } group-[.Mui-focused]:border-primary-600 group-[.Mui-error]:border-error-main  `,
                },
            }}
            labelId={labelId}
            id={id}
            value={value}
            onChange={onChange}
            MenuProps={{
                className: `${maxChildrenHeight}`,
            }}
        >
            {children}
        </Select>
    );
}
