"use client";
import MenuItem from "@mui/material/MenuItem";
interface Props {
    icons?: React.ReactNode[];
    options: string[];
    maxHeight?: string;
    itemWidth?: string;
    onClick?: () => void;
    onChange?: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

export default function ListChoice({
    icons,
    options,
    maxHeight = "max-h-[12.5rem]",
    itemWidth,
    onClick,
    onChange,
}: Props) {
    function ChoiceContainer({
        value,
        icon,
    }: {
        value: string;
        icon: React.ReactNode;
    }) {
        // Make sure to import MenuItem from @mui/material at the top of your file:
        // import MenuItem from '@mui/material/MenuItem';

        return (
            <MenuItem
                className={`${maxHeight} ${itemWidth}`}
                onClick={() => {
                    onClick?.();
                    onChange?.({ target: { value } } as React.ChangeEvent<{
                        value: unknown;
                    }>);
                }}
                value={value}
            >
                {icon}
                {value}
            </MenuItem>
        );
    }

    return options.map((option, index) => (
        <ChoiceContainer key={index} value={option} icon={icons?.[index]} />
    ));
}
