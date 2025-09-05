import { createTheme, Select } from "@mui/material";

interface Props {
    labelId: string;
    id: string;
    value: string;
    error?: boolean;
    disabled?: boolean;

    onChange?: (
        event:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<{ value: unknown }>
            | (Event & { target: { value: string; name?: string } }),
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
    onChange,
    children,
}: Props) {
    return (
        <Select
            error={error}
            disabled={disabled}
            // need to add group className at Parent element to let tailwind overwrite the default styles of child element
            className="group"
            slotProps={{
                notchedOutline: {
                    className: `border-gray-200 ${
                        disabled ? "" : "group-hover:border-gray-400"
                    } group-[.Mui-focused]:border-primary-600 group-[.Mui-error]:border-error-main  `,
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
