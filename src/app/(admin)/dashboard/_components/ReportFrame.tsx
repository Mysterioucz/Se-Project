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

    const problemTypeLabels: Record<string, string> = {
        PAYMENT_ISSUE: "Payment Issue",
        BOOOKING_ISSUE: "Booking Issue",
        CANCELLATION_REFUND: "Cancellation/Refund",
        EXTRA_SERVICE_ISSUE: "Extra Service Issue",
        ACCOUNT_SYSTEM_ISSUE: "Account/System Issue",
        FLIGHT_ROUTING_ADJUSTMENT_ISSUE: "Flight Routing/Adjustment Issue",
    };

    return (
        <div className="flex items-start gap-[0.5rem] self-stretch">
            {/* Report ID */}
            <div className="flex w-[3.75rem] items-center justify-center">
                <div className="font-sarabun text-[1rem] font-bold text-black">
                    {index}.
                </div>
            </div>

            {/* Priority */}
            <div className="flex w-[9.875rem] items-center justify-center">
                <ReportPiorityMarker priority={priority} />
            </div>

            {/* Status */}
            <div className="flex w-[9.875rem] items-center justify-center">
                <ReportStatusMarker status={status} />
            </div>

            {/* Problem Type */}
            <div className="flex w-[11.25rem] items-center justify-center">
                <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                    {problemTypeLabels[problemType] || problemType}
                </div>
            </div>

            {/* Submitted */}
            <div className="flex w-[11.25rem] items-center justify-center">
                <div className="font-sarabun text-[1rem] text-black">
                    {submitted}
                </div>
            </div>

            {/* Last Update */}
            <div className="flex w-[11.25rem] items-center justify-center">
                <div className="font-sarabun text-[1rem] text-black">
                    {lastUpdate}
                </div>
            </div>

            {/* Button */}
            <div className="flex w-[5.625rem] items-center justify-center">
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
                id={id}
                bookingId=""
                passengerEmail=""
                passengerPhone=""
                passengerFirstName=""
                passengerLastName=""
                problemType={problemType}
                description=""
                attachment={null}
                status={status}
                priority={priority}
                submitted={submitted}
                lastUpdate={lastUpdate}
            />
        </div>
    );
}
