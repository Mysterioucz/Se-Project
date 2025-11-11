import { StatusFilter } from "./Helper";

interface StatusFilterBarProps {
    selectedStatus: StatusFilter;
    onStatusChange: (status: StatusFilter) => void;
}

export default function StatusFilterBar({ selectedStatus, onStatusChange }: StatusFilterBarProps) {
    return (
        <div className="flex flex-row rounded-2xl p-2 gap-4 bg-gray-100">
            <button
                className={`w-full py-2 px-3 rounded-2xl font-bold text-[1rem] ${
                    selectedStatus === StatusFilter.SCHEDULED
                        ? "bg-gray-50 text-black"
                        : "text-gray-400 hover:bg-gray-200"
                }`}
                onClick={() => {
                    if (selectedStatus !== StatusFilter.SCHEDULED) {
                        onStatusChange(StatusFilter.SCHEDULED);
                    }else{
                        onStatusChange(StatusFilter.ALL);
                    }
                }}
            >
                Scheduled
            </button>
            <button
                className={`w-full py-2 px-3 rounded-2xl font-bold text-[1rem] ${
                    selectedStatus === StatusFilter.DEPARTED
                        ? "bg-gray-50 text-black"
                        : "text-gray-400 hover:bg-gray-200"
                }`}
                onClick={() => {
                    if (selectedStatus !== StatusFilter.DEPARTED) {
                        onStatusChange(StatusFilter.DEPARTED);
                    }else{
                        onStatusChange(StatusFilter.ALL);
                    }
                }}
            >
                Departed
            </button>
            <button
                className={`w-full py-2 px-3 rounded-2xl font-bold text-[1rem] ${
                    selectedStatus === StatusFilter.CANCELLED
                        ? "bg-gray-50 text-black"
                        : "text-gray-400 hover:bg-gray-200"
                }`}
                onClick={() => {
                    if (selectedStatus !== StatusFilter.CANCELLED) {
                        onStatusChange(StatusFilter.CANCELLED);
                    }else{
                        onStatusChange(StatusFilter.ALL);
                    }
                }}
            >
                Cancelled
            </button>
        </div>
    );
}