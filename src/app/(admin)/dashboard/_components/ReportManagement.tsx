"use client";
import SelectComponent, { SelectEvent } from "@/src/components/select";
import { MenuItem } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReportFrame from "./ReportFrame";

interface ReportSummary {
    id: string;
    priority: "normal" | "high";
    status: "opened" | "in progress" | "resolved" | "cancelled";
    problemType: string;
    submitted: string;
    lastUpdate: string;
}

export default function ReportManagement() {
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [reports, setReports] = useState<ReportSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/v1/reports")
            .then((res) => res.json())
            .then((res) => {
                if (res.success && Array.isArray(res.data)) {
                    setReports(res.data);
                } else {
                    setReports([]);
                }
            });
    }, []);

    const handleChange = (event: SelectEvent) => {
        const value = (event.target as HTMLInputElement).value as string;
        setPriority(value);
    };

    const setStatusChange = (event: SelectEvent) => {
        const value = (event.target as HTMLInputElement).value as string;
        setStatus(value);
    };

    return (
        <div className="flex flex-col items-start self-stretch rounded-[0.5rem] border-[0.125rem] border-primary-600 bg-white">
            {/* Header */}
            <div className="flex items-center self-stretch px-[1rem] py-[0.75rem] gap-[0.5rem]">
                <Image
                    src="/modal/fi-br-warning-blue.svg"
                    alt="Logo"
                    width={24}
                    height={24}
                />
                <div className="!text-primary-600 font-sarabun text-[2rem] font-bold leading-[1.2]">
                    Problem Report Management
                </div>
                {/* Filter area*/}
                <div className="flex justify-end items-center px-[1.25rem] py-0 gap-[0.625rem] flex-[1_0_0]">
                    <div className="flex flex-col items-start gap-1">
                        <div className="text-primary-900 text-[1rem] font-normal leading-[1.2]">
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
                        <div className="text-primary-900 text-[1rem] font-normal leading-[1.2]">
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

            {/* Table Body */}
            <div className="flex flex-col items-center self-stretch px-4 pb-4 pt-0">
                <div className="flex flex-col items-start gap-2 pb-2 rounded-md border-2 border-primary-100">
                    {/* Header Row */}
                    <div className="flex items-start gap-2 self-stretch bg-primary-100">
                        {[
                            "No.",
                            "Priority Level",
                            "Status",
                            "Problem Type",
                            "Submitted",
                            "Last Update",
                        ].map((h) => (
                            <div
                                key={h}
                                className="flex flex-col justify-center items-center w-[9.875rem] h-[3.125rem] py-[0.5rem]"
                            >
                                <div className="text-black text-center font-sarabun text-[1.25rem] font-semibold">
                                    {h}
                                </div>
                            </div>
                        ))}
                        <div className="w-[5.625rem]"></div>
                    </div>

                    {loading ? (
                        <div className="p-4 text-gray-500 font-sarabun">
                            Loading reports...
                        </div>
                    ) : (
                        reports.map((r, idx) => (
                            <ReportFrame key={r.id} index={idx + 1} {...r} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
