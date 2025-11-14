"use client";
import SelectComponent, { SelectEvent } from "@/src/components/select";
import { MenuItem } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReportFrame from "./ReportFrame";

interface ReportSummary {
    id: string;
    bookingID: string;
    description: string;
    attachment: string | null;
    status: "OPENED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
    priority: "NORMAL" | "HIGH";
    submittedAt: string;
    updatedAt: string;
    userAccountId: string;
    telNo: string;
    email: string;
    passengerFirstName: string;
    passengerLastName: string;
    problemType: string;
}

export default function ReportManagement() {
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [reports, setReports] = useState<ReportSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch("/api/v1/reports");
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const json = await res.json();
                if (json.success && Array.isArray(json.data)) {
                    setReports(json.data);
                } else {
                    setReports([]);
                }
            } catch (err) {
                console.error("Failed to fetch reports:", err);
                setReports([]);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handlePriorityChange = (event: SelectEvent) => {
        setPriority((event.target as HTMLInputElement).value);
    };

    const handleStatusChange = (event: SelectEvent) => {
        setStatus((event.target as HTMLInputElement).value);
    };

    const filteredReports = reports.filter((r) => {
        const priorityMatch =
            !priority || priority === "All Priority"
                ? true
                : r.priority === priority.toUpperCase();
        const statusMatch =
            !status || status === "All Status"
                ? true
                : r.status === status.toUpperCase();
        return priorityMatch && statusMatch;
    });

    return (
        <div className="border-primary-600 flex flex-col items-start self-stretch rounded-[0.5rem] border-[0.125rem] bg-white">
            <div className="flex items-center gap-[0.5rem] self-stretch px-[1rem] py-[0.75rem]">
                <Image
                    src="/modal/fi-br-warning-blue.svg"
                    alt="Logo"
                    width={24}
                    height={24}
                />
                <div className="!text-primary-600 font-sarabun text-[2rem] leading-[1.2] font-bold">
                    Problem Report Management
                </div>
                <div className="flex flex-[1_0_0] items-center justify-end gap-[0.625rem] px-[1.25rem] py-0">
                    <div className="flex flex-col items-start gap-1">
                        <div className="text-primary-900 text-[1rem] leading-[1.2] font-normal">
                            Priority Level:
                        </div>
                        <SelectComponent
                            labelId="priority-select-label"
                            id="priority-select"
                            value={priority}
                            onChange={handlePriorityChange}
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
                        <div className="text-primary-900 text-[1rem] leading-[1.2] font-normal">
                            Status:
                        </div>
                        <SelectComponent
                            labelId="status-select-label"
                            id="status-select"
                            value={status}
                            onChange={handleStatusChange}
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
            <div className="flex flex-col items-center self-stretch px-4 pt-0 pb-4">
                <div className="border-primary-100 flex flex-col items-start gap-2 rounded-md border-2 pb-2">
                    <div className="bg-primary-100 flex items-start gap-2 self-stretch">
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
                                className="flex h-[3.125rem] w-[9.875rem] flex-col items-center justify-center py-[0.5rem]"
                            >
                                <div className="font-sarabun text-center text-[1.25rem] font-semibold text-black">
                                    {h}
                                </div>
                            </div>
                        ))}
                        <div className="w-[5.625rem]"></div>
                    </div>
                    {loading ? (
                        <div className="font-sarabun p-4 text-gray-500">
                            Loading reports...
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="font-sarabun p-4 text-gray-500">
                            No reports found.
                        </div>
                    ) : (
                        filteredReports.map((r, idx) => (
                            <ReportFrame
                                key={r.id}
                                index={idx + 1}
                                id={r.id}
                                priority={
                                    r.priority.toLowerCase() as
                                        | "normal"
                                        | "high"
                                }
                                status={
                                    r.status === "IN_PROGRESS"
                                        ? "in progress"
                                        : (r.status.toLowerCase() as
                                              | "opened"
                                              | "resolved"
                                              | "cancelled"
                                              | "in progress")
                                }
                                problemType={r.problemType}
                                submitted={r.submittedAt}
                                lastUpdate={r.updatedAt}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
