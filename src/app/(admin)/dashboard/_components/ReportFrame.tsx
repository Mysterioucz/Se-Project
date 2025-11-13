import Button from "@/src/components/Button";
import { useState } from "react";
import ReportModal from "./ReportModal";
import ReportPiorityMarker from "./ReportPriorityMarker";
import ReportStatusMarker from "./ReportStatusMarker";

interface ReportFrameProps {
    id: string;
    index: number;
    priority: "normal" | "high";
    status: "opened" | "in progress" | "resolved" | "cancelled";
    problemType: string;
    submitted: string;
    lastUpdate: string;
}

export default function ReportFrame({
    id,
    index,
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
            <div className="flex justify-center items-center w-[3.75rem]">
                <div className="text-black font-sarabun text-[1rem] font-bold">
                    {index}.
                </div>
            </div>

            {/* Priority */}
            <div className="flex justify-center items-center w-[9.875rem]">
                <ReportPiorityMarker priority={priority} />
            </div>

            {/* Status */}
            <div className="flex justify-center items-center w-[9.875rem]">
                <ReportStatusMarker status={status} />
            </div>

            {/* Problem Type */}
            <div className="flex justify-center items-center w-[11.25rem]">
                <div className="text-black font-sarabun text-[1rem]">
                    {problemType}
                </div>
            </div>

            {/* Submitted */}
            <div className="flex justify-center items-center w-[11.25rem]">
                <div className="text-black font-sarabun text-[1rem]">
                    {submitted}
                </div>
            </div>

            {/* Last Update */}
            <div className="flex justify-center items-center w-[11.25rem]">
                <div className="text-black font-sarabun text-[1rem]">
                    {lastUpdate}
                </div>
            </div>

            {/* Button */}
            <div className="flex justify-center items-center w-[5.625rem]">
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
                reportId={id}
            />
        </div>
    );
}
