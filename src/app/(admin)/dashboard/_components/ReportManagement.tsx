import SelectComponent from "@/src/components/select";
import { SelectEvent } from "@/src/components/select";
import { MenuItem } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import ReportFrame from "./ReportFrame";

export default function ReportManagement() {
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");

     const handleChange = (event: SelectEvent) => {
        const value = (event.target as HTMLInputElement).value as string;
        setPriority(value);
    };

    const setStatusChange = (event: SelectEvent) => {
        const value = (event.target as HTMLInputElement).value as string;
        setStatus(value);
    };

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
                            <MenuItem value="All Priority">
                                All Priority
                            </MenuItem>
                            <MenuItem value="Normal">Normal</MenuItem>
                            <MenuItem value="High">High</MenuItem>
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

            <div className="flex flex-col items-center self-stretch px-4 pb-4 pt-0">
                <div className="flex flex-col items-start gap-2 pb-2 rounded-md border-2 border-[var(--color-primary-100)]">
                    {/* header */}
                    <div className="flex items-start gap-2 self-stretch bg-[var(--color-primary-100)]">
                        <div className="flex flex-col justify-center items-center w-[3.75rem] h-[3.125rem] py-[0.5rem]">
                            <div className="text-black text-center font-sarabun text-[1.25rem] font-semibold leading-[1.2]">
                                No.
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center w-[9.875rem] h-[3.125rem] py-[0.5rem]">
                            <div className="text-black text-center font-sarabun text-[1.25rem] font-semibold leading-[1.2]">
                                Priority Level
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center w-[9.875rem] h-[3.125rem] py-[0.5rem]">
                            <div className="text-black text-center font-sarabun text-[1.25rem] font-semibold leading-[1.2]">
                                Status
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center w-[11.25rem] h-[3.125rem] py-[0.5rem]">
                            <div className="text-black text-center font-sarabun text-[1.25rem] font-semibold leading-[1.2]">
                                Problem Type
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center w-[11.25rem] h-[3.125rem] py-[0.5rem]">
                            <div className="text-black text-center font-sarabun text-[1.25rem] font-semibold leading-[1.2]">
                                Submitted
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center w-[11.25rem] h-[3.125rem] py-[0.5rem]">
                            <div className="text-black text-center font-sarabun text-[1.25rem] font-semibold leading-[1.2]">
                                Last Update
                            </div>
                        </div>

                        {/* Space */}
                        <div className="flex flex-col justify-center items-center w-[5.625rem] h-[3.125rem] py-[0.5rem]"></div>
                    </div>

                    {/* reports */}
                    <ReportFrame
                        priority="normal"
                        status="opened"
                        problemType="Network Issue"
                        submitted="2025-08-06 19:32:10"
                        lastUpdate="2025-08-11 08:30:09"
                    />
                    <ReportFrame
                        priority="high"
                        status="in progress"
                        problemType="Software Bug"
                        submitted="2025-08-07 10:15:45"
                        lastUpdate="2025-08-12 14:22:30"
                    />
                    <ReportFrame
                        priority="normal"
                        status="resolved"
                        problemType="Hardware Failure"
                        submitted="2025-08-08 08:50:20"
                        lastUpdate="2025-08-13 09:10:15"
                    />
                </div>
            </div>
        </div>
    );
}
