import Button from "@/src/components/Button";
import SelectComponent from "@/src/components/select";
import { SelectEvent } from "@/src/components/select";
import { Dialog } from "@headlessui/react";
import { MenuItem } from "@mui/material";
import { useState } from "react";
import ReportPiorityMarker from "./ReportPriorityMarker";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ReportModal({ isOpen, onClose }: ReportModalProps) {
    const [status, setStatus] = useState("Opened"); // status must be current status
    const setStatusChange = (event: SelectEvent) => {
        const value = event.target.value as string;
        setStatus(value);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
        >
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

            {/* Center modal on screen */}
            <div className="relative z-[10000] flex flex-col items-start w-[49.25rem] max-h-[90vh] overflow-hidden rounded-[0.5rem] border-[0.25rem] border-[var(--color-primary-300)] bg-white shadow-xl">
                {/* Header (sticky) */}
                <div className="flex w-full h-[4.5625rem] p-[0.75rem] px-[1rem] items-center gap-[0.5rem] bg-[var(--color-primary-300)] z-10 ">
                    <div className="font-sarabun text-white text-[2rem] font-bold leading-[2.4rem]">
                        Report Details
                    </div>
                    <div className="flex h-[3.0625rem] py-0 px-[0.6875rem] justify-end items-center gap-[0.625rem] flex-1">
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
                {/* Scrollable body */}
                <div className="overflow-y-auto w-full">
                    {/* Content */}
                    <div className="flex w-full pt-[0.75rem] pr-[1rem] pb-[0.5rem] pl-[1rem] items-center gap-[0.5rem]">
                        <div className="font-sarabun text-[var(--color-primary-600)] text-[1.125rem] font-semibold leading-[1.35rem]">
                            Report ID:
                        </div>
                        <div className="font-sarabun text-black text-[1rem] font-normal leading-[1.2rem]">
                            f47ac10b-58cc-4372-a567-0e02b2c3d479
                        </div>
                    </div>

                    <div className="flex w-[788px] items-center gap-2 pt-2 pr-4 pb-3 pl-4">
                        <div className="font-sarabun text-[var(--color-primary-600)] text-[1.125rem] font-semibold leading-[1.35rem]">
                            Booking ID:
                        </div>
                        <div className="font-sarabun text-black text-[1rem] font-normal leading-[1.2rem]">
                            f47ac10b-58cc-4372-a567-0e02b2c3d479
                        </div>
                    </div>

                    <div className="flex w-[49.25rem] pt-0 pr-[1rem] pb-[1rem] pl-[1rem] items-start gap-[1rem]">
                        {/* Left Side Content */}
                        <div className="flex flex-col items-start gap-[1rem]">
                            <div className="flex w-[26.25rem] p-[1rem] flex-col items-start gap-[0.75rem] rounded-[0.5rem] bg-[var(--color-primary-50)]">
                                <div className="font-sarabun text-[var(--color-primary-900)] text-[1.5rem] font-semibold leading-[1.8rem]">
                                    Main Passenger Info
                                </div>
                                <div className="flex py-0 px-[1rem] items-start gap-[0.75rem] self-stretch">
                                    <div className="flex flex-col items-start gap-[0.5rem]">
                                        <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                            Email :
                                        </div>
                                        <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                            Phone Number :
                                        </div>
                                        <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                            Your Text
                                        </div>
                                        <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                            Your Text
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start gap-[0.5rem] flex-1">
                                        <div className="font-sarabun text-black text-[1rem] font-normal leading-[1.2rem]">
                                            markie@gmail.com
                                        </div>
                                        <div className="font-sarabun text-black text-[1rem] font-normal leading-[1.2rem]">
                                            088-888-8888
                                        </div>
                                        <div className="font-sarabun text-black text-[1rem] font-normal leading-[1.2rem]">
                                            Khanapong
                                        </div>
                                        <div className="font-sarabun text-black text-[1rem] font-normal leading-[1.2rem]">
                                            Kamchoom
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Problem Details */}
                            <div className="flex w-[26.25rem] p-[1rem] flex-col items-start gap-[0.75rem] rounded-[0.5rem] bg-[var(--color-primary-50)]">
                                <div className="font-sarabun text-[var(--color-primary-900)] text-[1.5rem] font-semibold leading-[1.8rem]">
                                    Problem Details
                                </div>
                                <div className="flex px-[1rem] items-start gap-[0.75rem] self-stretch">
                                    <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                        Problem Type :
                                    </div>
                                    <div className="font-sarabun text-black text-[1rem] font-normal leading-[1.2rem]">
                                        Flight Routing/Adjustment Issue
                                    </div>
                                </div>
                                <div className="flex px-[1rem] items-start gap-[0.75rem] self-stretch">
                                    <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                        Description :
                                    </div>
                                </div>

                                <div className="flex px-[1rem] py-0 items-start gap-[0.75rem] self-stretch">
                                    <div className="flex h-[12.5rem] p-[0.5rem] flex-col items-start gap-[0.5rem] flex-[1_0_0] rounded-[0.5rem] border border-[#B8E4EF] bg-white overflow-y-auto">
                                        <div className="text-black font-sarabun text-[1rem] font-normal leading-[1.5] break-words">
                                            Lorem ipsum dolor sit amet,
                                            consectetuer adipiscing elit. Aenean
                                            commodo ligula eget dolor. Aenean
                                            massa. Cum sociis natoque penatibus
                                            et magnis dis parturient montes,
                                            nascetur ridiculus mus. Donec quam
                                            felis, ultricies nec, pellentesque
                                            eu, pretium quis, sem. Nulla
                                            consequat massa quis enim. Donec
                                            pede justo, fringilla vel, aliquet
                                            nec, vulputate eget, arcu. In enim
                                            justo, rhoncus ut, imperdiet a,
                                            venenatis vitae, justo. Nullam
                                            dictum felis eu pede mollis pretium.
                                            Integer tincidunt. Cras dapibus.
                                            Vivamus elementum semper nisi.
                                            Aenean vulputate eleifend tellus.
                                            Aenean leo ligula, porttitor eu,
                                            consequat vitae, eleifend ac, enim.
                                            Aliquam lorem ante, dapibus in,
                                            viverra quis, feugiat a,
                                        </div>
                                    </div>
                                </div>

                                <div className="flex px-[1rem] items-start gap-[0.75rem] self-stretch">
                                    <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                        Attachment :
                                    </div>
                                </div>
                                <div className="flex px-[1rem] items-start gap-[0.75rem] self-stretch">
                                    <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                        {/* File attchhment placeholder */}
                                        <Button
                                            text="file.pdf"
                                            styleType="fill"
                                            size="md"
                                            width="w-[6.25rem]"
                                            height="h-[2.188rem]"
                                            onClick={() => {}}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side Empty Space */}
                        <div className="flex flex-col items-start gap-[1rem]">
                            {/* Status and Priority Level */}
                            <div className="flex w-[20rem] p-[1rem] flex-col items-start gap-[0.75rem] rounded-[0.5rem] bg-[var(--color-primary-50)]">
                                <div className="font-sarabun text-[var(--color-primary-900)] text-[1.5rem] font-semibold leading-[1.8rem]">
                                    Status and Priority Level
                                </div>
                                <div className="flex px-[1rem] py-0 items-start gap-[0.75rem] self-stretch">
                                    <div className="flex flex-col items-start gap-[0.75rem]">
                                        <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                            Status :
                                        </div>
                                        <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                            Priority Level :
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start gap-[0.5rem] flex-[1_0_0]">
                                        <div className="font-sarabun text-black text-[1rem] font-normal leading-[1.2rem]">
                                            Opened
                                        </div>
                                        <ReportPiorityMarker priority="normal" />
                                    </div>
                                </div>
                                <div className="flex p-[1rem] flex-col items-start gap-[0.75rem] self-stretch rounded-[0.5rem] bg-white">
                                    <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                        Change Status
                                    </div>

                                    {/* Todo: /*}
                                    {/*Placeholder must be current status */}
                                    <SelectComponent
                                        labelId="update-status-select"
                                        id="update-status-select"
                                        value={status}
                                        onChange={setStatusChange}
                                        placeholder="Opened"
                                        width="w-[16rem]"
                                        height="h-[2.188rem]"
                                        maxChildrenHeight="max-h-20"
                                    >
                                        <MenuItem value="Opened">
                                            Opened
                                        </MenuItem>
                                        <MenuItem value="In Progress">
                                            In Progress
                                        </MenuItem>
                                        <MenuItem value="Cancelled">
                                            Cancelled
                                        </MenuItem>
                                        <MenuItem value="Resolved">
                                            Resolved
                                        </MenuItem>
                                    </SelectComponent>

                                    <Button
                                        text="Update Status"
                                        styleType="stroke"
                                        size="md"
                                        width="w-[16rem]"
                                        height="h-[2.188rem]"
                                        onClick={() => {}}
                                    />
                                </div>
                            </div>

                            {/*Timeline */}
                            <div className="flex w-[20rem] p-[1rem] flex-col items-start gap-[0.75rem] rounded-[0.5rem] bg-[var(--color-primary-50)]">
                                <div className="font-sarabun text-[var(--color-primary-900)] text-[1.5rem] font-semibold leading-[1.8rem]">
                                    Timeline
                                </div>
                                <div className="flex px-[0.5rem] py-0 items-start gap-[0.75rem] self-stretch">
                                    <div className="flex flex-col items-start gap-[0.75rem]">
                                        <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                            Submitted :
                                        </div>
                                        <div className="font-sarabun text-[var(--color-primary-600)] text-[1rem] font-bold leading-[1.2rem]">
                                            Last Updated :
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start gap-[0.75rem]">
                                        <div className="font-sarabun text-black text-[1rem] font-normal leading-[1.2rem]">
                                            2025-08-06 19:32:10
                                        </div>
                                        <div className="font-sarabun text-black text-[1rem] font-normal leading-[1.2rem]">
                                            2025-08-11 08:30:09
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>{" "}
                {/* end scrollable body */}
            </div>
        </Dialog>
    );
}
