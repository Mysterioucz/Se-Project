"use client";
import SelectComponent, { SelectEvent } from "@/src/components/select";
import { MenuItem } from "@mui/material";

const priorityOptions = [
    { value: "Normal", label: "Normal" },
    { value: "High", label: "High" },
];

interface Props {
    value: string;
    onChange: (event: SelectEvent) => void;
}

export default function PrioritySelect({ value, onChange }: Props) {
    return (
        <div className="flex flex-col gap-2 text-lg">
            <label className="font-semibold text-gray-700">Priority Level*</label>
            <SelectComponent
                id="priority-level"
                labelId="priority-level-label"
                value={value}
                onChange={onChange}
                placeholder="Select Level"
            >
                {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </SelectComponent>
        </div>
    );
}