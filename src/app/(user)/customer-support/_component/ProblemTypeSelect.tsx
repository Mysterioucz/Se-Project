"use client";
import SelectComponent, { SelectEvent } from "@/src/components/select";
import { MenuItem } from "@mui/material";

const problemTypeOptions = [
    { value: "PAYMENT_ISSUE", label: "Payment Issue" },
    { value: "BOOOKING_ISSUE", label: "Booking Issue" }, // Note: typo in DB schema
    { value: "CANCELLATION_REFUND", label: "Cancellation / Refund" },
    { value: "EXTRA_SERVICE_ISSUE", label: "Extra Service Issue" },
    { value: "ACCOUNT_SYSTEM_ISSUE", label: "Account / System Issue" },
    {
        value: "FLIGHT_ROUTING_ADJUSTMENT_ISSUE",
        label: "Flight Rerouting / Adjustment Issue",
    },
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
