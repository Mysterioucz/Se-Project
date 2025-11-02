import SelectComponent from "@/src/components/select";
import { MenuItem } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import Image from "next/image";
import { useState } from "react";

export default function ReportManagement() {
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");

    const handleChange = (event: any) => {
        const value = event.target.value as string;
        setPriority(value);
    };

    const setStatusChange = (event: any) => {
        const value = event.target.value as string;
        setStatus(value);
    }

    return (
        <div className="flex flex-col items-start self-stretch rounded-[0.5rem] border-[0.125rem] border-[var(--color-primary-600)] bg-white">
            <div className="flex items-center self-stretch px-[1rem] py-[0.75rem] gap-[0.5rem]">
                <Image
                    src="/fi-br-warning.svg"
                    alt="Logo"
                    width={24}
                    height={24}
                />

                <div className="!text-[var(--color-primary-600)] font-sarabun text-[2rem] font-bold leading-[1.2] not-italic">
                    Problem Report Management
                </div>

                <div className="flex justify-end items-center px-[1.25rem] py-0 gap-[0.625rem] flex-[1_0_0]">
                    <div className="flex flex-col items-start gap-1">
                        <div className="text-[var(--color-primary-900)] font-sarabun text-[1rem] font-normal leading-[1.2] not-italic">
                            Priority Level:
                        </div>
                        <SelectComponent
                            labelId="priority-select-label"
                            id="priority-select"
                            value={priority}
                            onChange={handleChange}
                            placeholder="Select priority"
                            width="w-[12.5rem]"
                            height="h-[2rem]" 
                        >
                            <MenuItem value="Normal">Normal</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                            <MenuItem value="All Priority">All Priority</MenuItem>
                        </SelectComponent>
                    </div>
                    <div className="flex flex-col items-start gap-1">
                        <div className="text-[var(--color-primary-900)] font-sarabun text-[1rem] font-normal leading-[1.2] not-italic">
                            Status:
                        </div>
                        <SelectComponent
                            labelId="status-select-label"
                            id="status-select"
                            value={status}
                            onChange={setStatusChange}
                            placeholder="Select Status"
                            width="w-[12.5rem]"
                            height="h-[2rem]" 
                        >
                            <MenuItem value="All Status">All Status</MenuItem>
                            <MenuItem value="Opened">Opened</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                            <MenuItem value="Resolved">Resolved</MenuItem>
                        </SelectComponent>
                    </div>
                </div>
            </div>
        </div>
    );
}
