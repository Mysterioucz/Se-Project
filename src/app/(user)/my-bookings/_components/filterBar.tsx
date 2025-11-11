import { BookingStatus } from "@/src/lib/bookingHistory";

interface FilterBarProps {
    selectedStatus: BookingStatus;
    setStatus: (status: BookingStatus) => void;
}

function filterPill(
    index: number,
    status: BookingStatus,
    selectedStatus: BookingStatus,
    setStatus: (status: BookingStatus) => void,
) {
    return (
        <div
            key={index}
            className={`h-fit w-full cursor-pointer rounded-full px-4 py-2 text-center font-semibold ${
                status === selectedStatus
                    ? "text-common-black bg-gray-50"
                    : "text-gray-400"
            }`}
            onClick={() => setStatus(status)}
        >
            {status.charAt(0) + status.slice(1).toLowerCase()}
        </div>
    );
}

export default function FilterBar({
    selectedStatus,
    setStatus,
}: FilterBarProps) {
    const statuses: BookingStatus[] = ["SCHEDULED", "DEPARTED", "CANCELLED"];
    return (
        <div className="flex rounded-3xl bg-gray-100 p-3">
            {statuses.map((status, index) =>
                filterPill(index, status, selectedStatus, setStatus),
            )}
        </div>
    );
}
