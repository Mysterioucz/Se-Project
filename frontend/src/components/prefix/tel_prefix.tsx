// Update the import path to the correct location of SmallArrowDown
import SmallArrowDown from "../icons/fi-sr-angle-small-down.svg";
interface Props {
    value?: string;
    maxSize?: number;
    onChange?: (event: React.ChangeEvent<{ value: unknown }>) => void;
}

console.log(SmallArrowDown);

export default function TelPrefix({ value, maxSize = 5, onChange }: Props) {
    return (
        <div className="flex">
            <button>
            </button>
                <SmallArrowDown />
        </div>
    );
}
