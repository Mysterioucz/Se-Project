"use client";
import SelectComponent, { SelectEvent } from "@/src/components/select";
import TextFieldComponent from "@/src/components/text_field";
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
    const [searchId, setSearchId] = useState("");

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch("/api/v1/reports");
                if (!res.ok)
                    throw new Error(`HTTP error! status: ${res.status}`);
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
        const value = (event.target as HTMLInputElement).value;
        setStatus(value.toLowerCase());
    };

    const FE_STATUS_TO_BE: Record<string, string> = {
        opened: "OPENED",
        "in progress": "IN_PROGRESS",
        resolved: "RESOLVED",
        cancelled: "CANCELLED",
    };

    const filteredReports = reports.filter((r) => {
        const priorityMatch =
            !priority || priority === "All Priority"
                ? true
                : r.priority === priority.toUpperCase();

        const statusMatch =
            !status || status === "all status"
                ? true
                : r.status === FE_STATUS_TO_BE[status];

        const idMatch = !searchId
            ? true
            : r.id.toLowerCase().includes(searchId.toLowerCase());

        return priorityMatch && statusMatch && idMatch;
    });

    return (
        <div className="flex flex-col items-start self-stretch rounded-md border-2 border-[var(--color-primary-600)] bg-white">
            {/* Header */}
            <div className="flex items-center gap-2 self-stretch px-4 py-3">
                <Image
                    src="/modal/fi-br-warning-blue.svg"
                    alt="Logo"
                    width={24}
                    height={24}
                />
                <div className="font-sarabun text-[2rem] leading-[1.2] font-bold text-[var(--color-primary-600)]">
                    Problem Report Management
                </div>
                <div className="flex flex-1 justify-end gap-2">
                    {/* Search by ID */}
                    <div className="flex flex-col gap-1">
                        <div className="font-sarabun text-[1rem] font-normal text-[var(--color-primary-900)]">
                            Search Report ID:
                        </div>
                        <TextFieldComponent
                            textValue={searchId}
                            placeHolder="Enter Report ID"
                            width="w-[12.5rem]"
                            height="h-[2rem]"
                            gap="gap-0"
                            labelSize="!text-sm"
                            onChange={({ text }) => setSearchId(text)}
                        />
                    </div>

                    {/* Priority Filter */}
                    <div className="flex flex-col gap-1">
                        <div className="font-sarabun text-[1rem] font-normal text-[var(--color-primary-900)]">
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
                    {/* Status Filter */}
                    <div className="flex flex-col gap-1">
                        <div className="font-sarabun text-[1rem] font-normal text-[var(--color-primary-900)]">
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
                            renderSelected={(value) => {
                                if (!value) return "Select Status";
                                const mapping: Record<string, string> = {
                                    opened: "Opened",
                                    "in progress": "In Progress",
                                    resolved: "Resolved",
                                    cancelled: "Cancelled",
                                    "all status": "All Status",
                                };
                                return mapping[value] ?? value;
                            }}
                        >
                            <MenuItem value="all status">All Status</MenuItem>
                            <MenuItem value="opened">Opened</MenuItem>
                            <MenuItem value="in progress">In Progress</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                            <MenuItem value="resolved">Resolved</MenuItem>
                        </SelectComponent>
                    </div>
                </div>
            </div>

            {/* Report Table */}
            <div className="flex flex-col items-center self-stretch px-4 pt-0 pb-4">
                <div className="flex flex-col items-start gap-2 rounded-md border-2 border-[var(--color-primary-100)] pb-2">
                    {/* Table Header */}
                    <div className="flex items-start gap-2 self-stretch bg-[var(--color-primary-100)]">
                        {[
                            { title: "No.", width: "w-[3.75rem]" },
                            { title: "Priority Level", width: "w-[9.875rem]" },
                            { title: "Status", width: "w-[9.875rem]" },
                            { title: "Problem Type", width: "w-[11.25rem]" },
                            { title: "Submitted", width: "w-[11.25rem]" },
                            { title: "Last Update", width: "w-[11.25rem]" },
                        ].map((h) => (
                            <div
                                key={h.title}
                                className={`${h.width} flex h-[3.125rem] flex-col items-center justify-center py-[0.5rem]`}
                            >
                                <div className="font-sarabun text-center text-[1.25rem] leading-[1.2] font-semibold text-black">
                                    {h.title}
                                </div>
                            </div>
                        ))}
                        <div className="h-[3.125rem] w-[5.625rem] py-[0.5rem]"></div>
                    </div>

                    {/* Table Rows */}
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
                                bookingID={r.bookingID}
                                description={r.description}
                                attachment={r.attachment}
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
                                passengerEmail={r.email}
                                passengerPhone={r.telNo}
                                passengerFirstName={r.passengerFirstName}
                                passengerLastName={r.passengerLastName}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
