import Button from "@/src/components/Button";
import ReportPiorityMarker from "./ReportPriorityMarker";
import ReportStatusMarker from "./ReportStatusMarker";
import ReportModal from "./ReportModal";
import { useState } from "react";

interface ReportFrameProps {
    priority: "normal" | "high";
    status: "opened" | "in progress" | "resolved" | "cancelled";
    problemType: string;
    submitted: string;
    lastUpdate: string;
}

export default function ReportFrame({
    priority,
    status,
    problemType,
    submitted,
    lastUpdate,
}: ReportFrameProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex items-start gap-[0.5rem] self-stretch">
            {/* Report ID */}
            <div className="flex flex-col justify-center items-center w-[3.75rem] h-[3.125rem] py-[0.5rem]">
                <div className="text-black text-center font-sarabun text-[1rem] font-bold leading-[1.2]">
                    1.
                </div>
            </div>

            {/* Priority Level */}
            <div className="flex flex-col justify-center items-center w-[9.875rem] h-[3.125rem] py-[0.5rem]">
                <ReportPiorityMarker priority={priority} />
            </div>

            {/* Status */}
            <div className="flex flex-col justify-center items-center w-[9.875rem] h-[3.125rem] py-[0.5rem]">
                <ReportStatusMarker status={status} />
            </div>

            {/* Problem Type */}
            <div className="flex flex-col justify-center items-center w-[11.25rem] h-[3.125rem] py-[0.5rem]">
                <div className="text-black text-center font-sarabun text-[1rem] font-normal leading-[1.2]">
                    {problemType}
                </div>
            </div>

            {/* Submitted */}
            <div className="flex flex-col justify-center items-center w-[11.25rem] h-[3.125rem] py-[0.5rem]">
                <div className="text-black text-center font-sarabun text-[1rem] font-normal leading-[1.2]">
                    {submitted}
                </div>
            </div>

            {/* Last Update */}
            <div className="flex flex-col justify-center items-center w-[11.25rem] h-[3.125rem] py-[0.5rem]">
                <div className="text-black text-center font-sarabun text-[1rem] font-normal leading-[1.2]">
                    {lastUpdate}
                </div>
            </div>

            {/* Modal */}
            <div className="flex flex-col justify-center items-center w-[5.625rem] h-[3.125rem] py-[0.5rem]">
                <Button
                    text="View"
                    align="center"
                    styleType="fill"
                    size="sm"
                    width="w-[4.25rem]"
                    height="h-[2.188rem]"
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            {/* Modal */}
            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
            </ReportModal>
        </div>
    );
}
