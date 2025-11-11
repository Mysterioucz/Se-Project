interface SearchFieldProps {
    value: string;
    onChange?: (value: string) => void;
}

export default function SearchField({ value, onChange }: SearchFieldProps) {
    return (
        <>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                placeholder="Search by Booking ID"
                className="flex flex-row w-full rounded-2xl p-3 g-4 bg-gray-50"
            />
        </>
    );
}
