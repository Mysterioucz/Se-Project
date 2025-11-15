import Button from "@/src/components/Button";
import { useState } from "react";
import ReportModal from "./ReportModal";
import ReportPiorityMarker from "./ReportPriorityMarker";
import ReportStatusMarker from "./ReportStatusMarker";

interface ReportFrameProps {
    id: string;
    index: number;
    bookingID: string;
    description: string;
    attachment: string | null;
    priority: "normal" | "high";
    status: "opened" | "in progress" | "resolved" | "cancelled";
    problemType: string;
    submitted: string;
    lastUpdate: string;
    passengerEmail: string;
    passengerPhone: string;
    passengerFirstName: string;
    passengerLastName: string;
}

export default function ReportFrame({
    id,
    index,
    bookingID,
    description,
    attachment,
    priority,
    status,
    problemType,
    submitted,
    lastUpdate,
    passengerEmail,
    passengerPhone,
    passengerFirstName,
    passengerLastName,
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
            <div className="flex h-[3.125rem] w-[3.75rem] flex-col items-center justify-center p-2">
                <div className="font-sarabun text-[1rem] font-bold text-black">
                    {index}.
                </div>
            </div>

            {/* Priority */}
            <div className="flex h-[3.125rem] w-[9.875rem] flex-col items-center justify-center px-0 py-2">
                <ReportPiorityMarker priority={priority} />
            </div>

            {/* Status */}
            <div className="flex h-[3.125rem] w-[9.875rem] flex-col items-center justify-center px-0 py-2">
                <ReportStatusMarker status={status} />
            </div>

            {/* Problem Type */}
            <div className="flex h-[3.125rem] w-[11.25rem] flex-col items-center justify-center px-0 py-2">
                <div className="font-sarabun text-[1rem] leading-[1.2rem] font-normal text-black">
                    {problemTypeLabels[problemType] || problemType}
                </div>
            </div>

            {/* Submitted */}
            <div className="flex h-[3.125rem] w-[11.25rem] flex-col items-center justify-center px-0 py-2">
                <div className="font-sarabun text-[1rem] text-black">
                    {formatDateTime(submitted)}
                </div>
            </div>

            {/* Last Update */}
            <div className="flex h-[3.125rem] w-[11.25rem] flex-col items-center justify-center px-0 py-2">
                <div className="font-sarabun text-[1rem] text-black">
                    {formatDateTime(lastUpdate)}
                </div>
            </div>

            {/* Button */}
            <div className="flex h-[3.125rem] w-[5.625rem] flex-col items-center justify-center gap-[0.625rem] px-[0.6875rem] py-2">
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
                bookingId={bookingID}
                passengerEmail={passengerEmail}
                passengerPhone={passengerPhone}
                passengerFirstName={passengerFirstName}
                passengerLastName={passengerLastName}
                problemType={problemType}
                description={description}
                attachment={attachment}
                status={status}
                priority={priority}
                submitted={submitted}
                lastUpdate={lastUpdate}
            />
        </div>
    );
}
