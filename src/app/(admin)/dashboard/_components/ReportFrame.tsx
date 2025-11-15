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

    function formatDateTime(dateString: string) {
        const date = new Date(dateString);
        const pad = (n: number) => n.toString().padStart(2, "0");

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());

        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    return (
        <div className="flex items-start gap-[0.5rem] self-stretch">
            {/* Report ID */}
            <div className="flex w-[3.75rem] h-[3.125rem] flex-col justify-center items-center p-2">
                <div className="font-sarabun text-[1rem] font-bold text-black">
                    {index}.
                </div>
            </div>

            {/* Priority */}
            <div className="flex w-[9.875rem] h-[3.125rem] flex-col justify-center items-center py-2 px-0">
                <ReportPiorityMarker priority={priority} />
            </div>

            {/* Status */}
            <div className="flex w-[9.875rem] h-[3.125rem] flex-col justify-center items-center py-2 px-0">
                <ReportStatusMarker status={status} />
            </div>

            {/* Problem Type */}
            <div className="flex w-[11.25rem] h-[3.125rem] flex-col justify-center items-center py-2 px-0">
                <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                    {problemTypeLabels[problemType] || problemType}
                </div>
            </div>

            {/* Submitted */}
            <div className="flex w-[11.25rem] h-[3.125rem] flex-col justify-center items-center py-2 px-0">
                <div className="font-sarabun text-[1rem] text-black">
                    {formatDateTime(submitted)}
                </div>
            </div>

            {/* Last Update */}
            <div className="flex w-[11.25rem] h-[3.125rem] flex-col justify-center items-center py-2 px-0">
                <div className="font-sarabun text-[1rem] text-black">
                    {formatDateTime(lastUpdate)}
                </div>
            </div>

            {/* Button */}
            <div className="flex w-[5.625rem] h-[3.125rem] flex-col justify-center items-center px-[0.6875rem] py-2 gap-[0.625rem]">
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
