import SelectComponent, { OnChangeEvent } from "../select";

export interface PanelData {
    adultCount: number;
    childCount: number;
    infantCount: number;
    seatClass: string;
}

interface Props {
    panelData: PanelData;
    onClick?: () => void;
    onChange?: (key: keyof PanelData, value: number | string) => void;
}

interface ItemListProps {
    itemName: string;
    itemKey: keyof PanelData;
    itemDesc: string;
    onChange: (key: keyof PanelData, value: number) => void;
    count: number;
}

function ItemList({
    itemName,
    itemKey,
    itemDesc,
    onChange,
    count,
}: ItemListProps) {
    return (
        <div className="flex w-full gap-4">
            <div className="flex flex-col w-full">
                <p className="text-primary-900 text-sm">{itemName}</p>
                <p className="text-gray-300 text-xs">{itemDesc}</p>
            </div>
            <div className="flex gap-2 items-center justify-center">
                <button
                    className="text-gray-200"
                    onClick={(e) => {
                        const newCount = Math.max(0, count - 1);
                        onChange(itemKey as keyof PanelData, newCount);
                    }}
                >
                    -
                </button>
                <p>{count}</p>
                <button
                    className="text-primary-400"
                    onClick={(e) => {
                        const newCount = count + 1;
                        onChange(itemKey as keyof PanelData, newCount);
                    }}
                >
                    +
                </button>
            </div>
        </div>
    );
}

function SelectPassengerPanel({ panelData, onClick, onChange }: Props) {
    return (
        <div className="flex flex-col w-fit h-fit border-primary-600 border-2 rounded-sm gap-3 p-4">
            <ItemList
                itemName="Adult"
                itemKey="adultCount"
                itemDesc="Aged 12 and above"
                count={panelData.adultCount}
                onChange={(key, value) => onChange?.(key, value)}
            />
            <ItemList
                itemName="Child"
                itemKey="childCount"
                itemDesc="Aged 2 to 11"
                count={panelData.childCount}
                onChange={(key, value) => onChange?.(key, value)}
            />
            <ItemList
                itemName="Infant"
                itemKey="infantCount"
                itemDesc="Under 2 years"
                count={panelData.infantCount}
                onChange={(key, value) => onChange?.(key, value)}
            />
            <SelectComponent
                labelId="Select Passenger Type"
                id="passenger-type"
                value={panelData.seatClass}
                onChange={(e: OnChangeEvent) => {
                    onChange?.("seatClass", e.target.value as string);
                }}
            />
            <div className="flex flex-col justify-baseline">
                {/* TODO: Replace with Button Component */}
                <button className="bg-primary-400 text-common-white rounded-sm m-2 p-2">
                    Apply
                </button>
            </div>
        </div>
    );
}

export default SelectPassengerPanel;
