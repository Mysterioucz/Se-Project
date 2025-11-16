export default function ReportPiorityMarker({
    priority,
}: {
    priority: "normal" | "high";
}) {
    return (
        <div
            className={`flex w-[4.25rem] px-2 py-1 flex-col justify-center items-center rounded-sm ${
                priority === "normal"
                    ? "bg-warning-main"
                    : priority === "high"
                      ? "bg-error-main"
                      : ""
            }`}
        >
            <div className="text-white text-center font-sarabun text-[1rem] font-normal leading-[1.2]">
                {priority === "normal"
                    ? "Normal"
                    : priority === "high"
                      ? "High"
                      : ""}
            </div>
        </div>
    );
}
