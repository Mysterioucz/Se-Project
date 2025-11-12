export default function ReportStatusMarker({
    status,
}: {
    status: "opened" | "in progress" | "resolved" | "cancelled";
}) {
    return (
        <div
            className={`flex w-[5.875rem] px-2 py-1 flex-col justify-center items-center rounded-sm ${
                status === "opened"
                    ? "bg-primary-100"
                    : status === "in progress"
                      ? "bg-warning-light"
                      : status === "resolved"
                        ? "bg-success-light"
                        : status === "cancelled"
                          ? "bg-error-light"
                          : ""
            }`}
        >
            <div className="text-black text-center font-sarabun text-[1rem] font-normal leading-[1.2]">
                {status === "opened"
                    ? "Opened"
                    : status === "in progress"
                      ? "In Progress"
                      : status === "resolved"
                        ? "Resolved"
                        : status === "cancelled"
                          ? "Cancelled"
                          : ""}
            </div>
        </div>
    );
}
