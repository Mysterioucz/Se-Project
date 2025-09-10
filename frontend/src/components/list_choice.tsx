"use client";
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
        return (
            <option
                className={`p-3 cursor-pointer hover:bg-gray-50 ${itemWidth}`}
                onClick={() => {
                    onClick?.();
                    onChange?.({ target: { value } } as React.ChangeEvent<{
                        value: unknown;
                    }>);
                }}
            >
                {icon}
                {value}
            </option>
        );
    }

    return options.map((option, index) => (
        <ChoiceContainer key={index} value={option} icon={icons?.[index]} />
    ));
}
