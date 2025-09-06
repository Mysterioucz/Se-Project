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
            <div
                className={`p-2 cursor-pointer ${itemWidth}`}
                onClick={() => {
                    onClick?.();
                    onChange?.({ target: { value } } as React.ChangeEvent<{
                        value: unknown;
                    }>);
                }}
            >
                {icon}
                {value}
            </div>
        );
    }

    return (
        <div
            className={`flex w-fit shadow-lg/20 p-1 ${maxHeight} top-[100%] bg-common-white flex-col absolute z-10 overflow-y-auto overflow-x-clip`}
        >
            {options.map((option, index) => (
                <ChoiceContainer
                    key={index}
                    value={option}
                    icon={icons?.[index]}
                />
            ))}
        </div>
    );
}
