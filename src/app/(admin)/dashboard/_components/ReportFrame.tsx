import Button from "@/src/components/Button";
import { useState } from "react";
import ReportModal from "./ReportModal";
import ReportPiorityMarker from "./ReportPriorityMarker";
import ReportStatusMarker from "./ReportStatusMarker";
import type { ReportSummary } from "./ReportManagement";

interface ReportFrameProps {
    index: number;
    report: ReportSummary;
}

export default function ReportFrame({ index, report }: ReportFrameProps) {
    const {
        id,
        priority,
        status,
        problemType,
        submittedAt,
        updatedAt,
        bookingID,
        email,
        telNo,
        passengerFirstName,
        passengerLastName,
        description
    } = report;

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

        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
            date.getDate()
        )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
            date.getSeconds()
        )}`;
    }

    return (
        <div className="flex items-start gap-[0.5rem] self-stretch">
            <div className="flex w-[3.75rem] h-[3.125rem] flex-col justify-center items-center p-2">
                <div className="font-sarabun text-[1rem] font-bold text-black">
                    {index}.
                </div>
            </div>

            <div className="flex w-[9.875rem] h-[3.125rem] flex-col justify-center items-center">
                <ReportPiorityMarker priority={priority.toLowerCase() as any} />
            </div>

            <div className="flex w-[9.875rem] h-[3.125rem] flex-col justify-center items-center">
                <ReportStatusMarker status={status.toLowerCase() as any} />
            </div>

            <div className="flex w-[11.25rem] h-[3.125rem] flex-col justify-center items-center">
                <div className="font-sarabun text-[1rem] font-normal text-black">
                    {problemTypeLabels[problemType] || problemType}
                </div>
            </div>

            <div className="flex w-[11.25rem] h-[3.125rem] flex-col justify-center items-center">
                <div className="font-sarabun text-[1rem] text-black">
                    {formatDateTime(submittedAt)}
                </div>
            </div>

            <div className="flex w-[11.25rem] h-[3.125rem] flex-col justify-center items-center">
                <div className="font-sarabun text-[1rem] text-black">
                    {formatDateTime(updatedAt)}
                </div>
            </div>

            <div className="flex w-[5.625rem] h-[3.125rem] flex-col justify-center items-center">
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

            <ReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                id={id}
                bookingId={bookingID}
                passengerEmail={email}
                passengerPhone={telNo}
                passengerFirstName={passengerFirstName}
                passengerLastName={passengerLastName}
                problemType={problemType}
                description={description}
                status={status.toLowerCase() as any}
                priority={priority.toLowerCase() as any}
                submitted={submittedAt}
                lastUpdate={updatedAt}
            />
        </div>
    );
}
