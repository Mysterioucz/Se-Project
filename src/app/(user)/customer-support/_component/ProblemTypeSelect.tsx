"use client";
import SelectComponent, { SelectEvent } from "@/src/components/select";
import { MenuItem } from "@mui/material";

const problemTypeOptions = [
    { value: "Booking Issue", label: "Booking Issue" },
    { value: "Payment Issue", label: "Payment Issue" },
    { value: "Cancellation / Refund", label: "Cancellation / Refund" },
    { value: "Extra Service Issue", label: "Extra Service Issue" },
    { value: "Account / System Issue", label: "Account / System Issue" },
    { value: "Flight Rerouting / Adjustment Issue", label: "Flight Rerouting / Adjustment Issue" }
];

interface Props {
    value: string;
    onChange: (event: SelectEvent) => void;
}

export default function ProblemTypeSelect({ value, onChange }: Props) {
    return (
        <div className="flex flex-col gap-2 text-lg">
            <label className="font-semibold text-gray-700">Problem Type*</label>
            <SelectComponent
                id="problem-type"
                labelId="problem-type-label"
                value={value}
                onChange={onChange}
                placeholder="Select Problem Type"
            >
                {problemTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </SelectComponent>
        </div>
    );
}