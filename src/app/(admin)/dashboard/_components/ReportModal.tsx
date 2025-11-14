"use client";

import Button from "@/src/components/Button";
import SelectComponent, { SelectEvent } from "@/src/components/select";
import { MenuItem } from "@mui/material";
import { useState } from "react";
import ReportPiorityMarker from "./ReportPriorityMarker";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    id: string;
    bookingId: string;
    passengerEmail: string;
    passengerPhone: string;
    passengerFirstName: string;
    passengerLastName: string;
    problemType: string;
    description: string;
    attachment: string | null;
    status: "opened" | "in progress" | "resolved" | "cancelled";
    priority: "normal" | "high";
    submitted: string;
    lastUpdate: string;
}

export default function ReportModal({
    isOpen,
    onClose,
    id,
    bookingId,
    passengerEmail,
    passengerPhone,
    passengerFirstName,
    passengerLastName,
    problemType,
    description,
    attachment,
    status: initialStatus,
    priority,
    submitted,
    lastUpdate,
}: ReportModalProps) {
    const [status, setStatus] = useState(initialStatus);

    const handleStatusChange = (event: SelectEvent) => {
        setStatus(
            event.target.value as
                | "opened"
                | "in progress"
                | "resolved"
                | "cancelled",
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-[10000] flex max-h-[90vh] w-[49.25rem] flex-col items-start overflow-hidden rounded-[0.5rem] border-[0.25rem] border-[var(--color-primary-300)] bg-white shadow-xl">
                {/* Header */}
                <div className="z-10 flex h-[4.5625rem] w-full items-center gap-[0.5rem] bg-[var(--color-primary-300)] p-[0.75rem] px-[1rem]">
                    <div className="font-sarabun text-[2rem] leading-[2.4rem] font-bold text-white">
                        Report Details
                    </div>
                    <div className="flex h-[3.0625rem] flex-1 items-center justify-end gap-[0.625rem] px-[0.6875rem] py-0">
                        <Button
                            text="Exit"
                            styleType="red-critical"
                            size="md"
                            width="w-[4.25rem]"
                            height="h-[2.188rem]"
                            onClick={onClose}
                        />
                    </div>
                </div>
                {/* Body */}
                <div className="w-full overflow-y-auto">
                    {/* Report & Booking ID */}
                    <div className="flex w-full items-center gap-[0.5rem] pt-[0.75rem] pr-[1rem] pb-[0.5rem] pl-[1rem]">
                        <div className="font-sarabun text-[1.125rem] leading-[1.35rem] font-semibold text-[var(--color-primary-600)]">
                            Report ID:
                        </div>
                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                            {id}
                        </div>
                    </div>
                    <div className="flex w-[788px] items-center gap-2 pt-2 pr-4 pb-3 pl-4">
                        <div className="font-sarabun text-[1.125rem] leading-[1.35rem] font-semibold text-[var(--color-primary-600)]">
                            Booking ID:
                        </div>
                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                            {bookingId || "-"}
                        </div>
                    </div>

                    <div className="flex w-[49.25rem] items-start gap-[1rem] pt-0 pr-[1rem] pb-[1rem] pl-[1rem]">
                        {/* Left column */}
                        <div className="flex flex-col items-start gap-[1rem]">
                            {/* Passenger Info */}
                            <div className="flex w-[26.25rem] flex-col items-start gap-[0.75rem] rounded-[0.5rem] bg-[var(--color-primary-50)] p-[1rem]">
                                <div className="font-sarabun text-[1.5rem] leading-[1.8rem] font-semibold text-[var(--color-primary-900)]">
                                    Main Passenger Info
                                </div>
                                <div className="flex items-start gap-[0.75rem] self-stretch px-[1rem] py-0">
                                    <div className="flex flex-col items-start gap-[0.5rem]">
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                            Email:
                                        </div>
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                            Phone Number:
                                        </div>
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                            First Name:
                                        </div>
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                            Last Name:
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col items-start gap-[0.5rem]">
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                                            {passengerEmail || "-"}
                                        </div>
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                                            {passengerPhone || "-"}
                                        </div>
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                                            {passengerFirstName || "-"}
                                        </div>
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                                            {passengerLastName || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Problem Details */}
                            <div className="flex w-[26.25rem] flex-col items-start gap-[0.75rem] rounded-[0.5rem] bg-[var(--color-primary-50)] p-[1rem]">
                                <div className="font-sarabun text-[1.5rem] leading-[1.8rem] font-semibold text-[var(--color-primary-900)]">
                                    Problem Details
                                </div>
                                <div className="flex items-start gap-[0.75rem] self-stretch px-[1rem]">
                                    <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                        Problem Type:
                                    </div>
                                    <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                                        {problemType}
                                    </div>
                                </div>
                                <div className="flex items-start gap-[0.75rem] self-stretch px-[1rem]">
                                    <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                        Description:
                                    </div>
                                </div>
                                <div className="flex items-start gap-[0.75rem] self-stretch px-[1rem] py-0">
                                    <div className="flex h-[12.5rem] flex-[1_0_0] flex-col items-start gap-[0.5rem] overflow-y-auto rounded-[0.5rem] border border-[#B8E4EF] bg-white p-[0.5rem]">
                                        <div className="font-sarabun text-[1rem] leading-[1.5] font-normal break-words text-black">
                                            {description || "-"}
                                        </div>
                                    </div>
                                </div>
                                {attachment && (
                                    <div className="flex items-start gap-[0.75rem] self-stretch px-[1rem]">
                                        <Button
                                            text={attachment}
                                            styleType="fill"
                                            size="md"
                                            width="w-[6.25rem]"
                                            height="h-[2.188rem]"
                                            onClick={() => {}}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right column */}
                        <div className="flex flex-col items-start gap-[1rem]">
                            {/* Status & Priority */}
                            <div className="flex w-[20rem] flex-col items-start gap-[0.75rem] rounded-[0.5rem] bg-[var(--color-primary-50)] p-[1rem]">
                                <div className="font-sarabun text-[1.5rem] leading-[1.8rem] font-semibold text-[var(--color-primary-900)]">
                                    Status and Priority Level
                                </div>
                                <div className="flex items-start gap-[0.75rem] self-stretch px-[1rem] py-0">
                                    <div className="flex flex-col items-start gap-[0.75rem]">
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                            Status:
                                        </div>
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                            Priority Level:
                                        </div>
                                    </div>
                                    <div className="flex flex-[1_0_0] flex-col items-start gap-[0.5rem]">
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                                            {status}
                                        </div>
                                        <ReportPiorityMarker
                                            priority={priority}
                                        />
                                    </div>
                                </div>

                                {/* Change Status */}
                                <div className="flex flex-col items-start gap-[0.75rem] self-stretch rounded-[0.5rem] bg-white p-[1rem]">
                                    <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                        Change Status
                                    </div>
                                    <SelectComponent
                                        labelId="update-status-select"
                                        id="update-status-select"
                                        value={status}
                                        onChange={handleStatusChange}
                                        placeholder={status}
                                        width="w-[16rem]"
                                        height="h-[2.188rem]"
                                        maxChildrenHeight="h-[12.5rem]"
                                    >
                                        <MenuItem value="opened">
                                            Opened
                                        </MenuItem>
                                        <MenuItem value="in progress">
                                            In Progress
                                        </MenuItem>
                                        <MenuItem value="cancelled">
                                            Cancelled
                                        </MenuItem>
                                        <MenuItem value="resolved">
                                            Resolved
                                        </MenuItem>
                                    </SelectComponent>

                                    <Button
                                        text="Update Status"
                                        styleType="stroke"
                                        size="md"
                                        width="w-[16rem]"
                                        height="h-[2.188rem]"
                                        onClick={() =>
                                            console.log(
                                                "Update status:",
                                                status,
                                            )
                                        }
                                    />
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="flex w-[20rem] flex-col items-start gap-[0.75rem] rounded-[0.5rem] bg-[var(--color-primary-50)] p-[1rem]">
                                <div className="font-sarabun text-[1.5rem] leading-[1.8rem] font-semibold text-[var(--color-primary-900)]">
                                    Timeline
                                </div>
                                <div className="flex items-start gap-[0.75rem] self-stretch px-[0.5rem] py-0">
                                    <div className="flex flex-col items-start gap-[0.75rem]">
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                            Submitted:
                                        </div>
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-bold text-[var(--color-primary-600)]">
                                            Last Updated:
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start gap-[0.75rem]">
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                                            {submitted}
                                        </div>
                                        <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                                            {lastUpdate}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>{" "}
            </div>
        </div>
    );
}
