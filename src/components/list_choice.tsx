"use client";
import MenuItem from "@mui/material/MenuItem";

export interface Option {
    prefix?: React.ReactNode;
    value: string;
    suffix?: React.ReactNode;
}
interface Props {
    options: Option[];
    maxHeight?: string;
    itemWidth?: string;
    onClick?: () => void;
    onChange?: (event: React.ChangeEvent<{ value: string }>) => void;
}

export default function ListChoice({
    options,
    maxHeight = "max-h-[12.5rem]",
    itemWidth,
    onClick,
    onChange,
}: Props) {
    function ChoiceContainer({ option }: { option: Option }) {
        return (
            <MenuItem
                className={`${maxHeight} ${itemWidth}`}
                onClick={() => {
                    // onClick?.(); fix this error
                    onChange?.({
                        target: { value: option.value },
                    } as React.ChangeEvent<{
                        value: string;
                    }>);
                }}
                value={option.value}
            >
                <div className="flex gap-2">
                    {option.prefix}
                    {option.value}
                    {option.suffix}
                </div>
            </MenuItem>
        );
    }

    return options.map((option) => (
        <ChoiceContainer key={option.value} option={option} />
    ));
}
