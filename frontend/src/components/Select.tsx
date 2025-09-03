"use client";
import { createTheme, Select } from "@mui/material";

interface Props {
    labelId: string;
    id: string;
    value: string;
    onChange?: (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<{ value: unknown }>
            | (Event & { target: { value: string; name?: string } }),
        child?: React.ReactNode
    ) => void;
    children?: React.ReactNode;
}

export default function SelectShowList({
    labelId,
    id,
    value,
    onChange,
    children,
}: Props) {
    return (
        <Select
        // need to add group className at Parent element to let tailwind overwrite the default styles of child element
            className="group"
            slotProps={{
                notchedOutline: {
                    className: ` group-[.Mui-error]:border-error-main border-primary-600 `,
                },
            }}
            labelId={labelId}
            id={id}
            value={value}
            onChange={onChange}
        >
            {children}
        </Select>
    );
}
