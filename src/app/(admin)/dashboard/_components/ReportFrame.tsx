import ReportPiorityMarker from "./ReportPriorityMarker";
import ReportStatusMarker from "./ReportStatusMarker";

export default function ReportFrame() {
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
                <ReportPiorityMarker priority="high" />
            </div>

            {/* Status */}
            <div className="flex flex-col justify-center items-center w-[9.875rem] h-[3.125rem] py-[0.5rem]">
                <ReportStatusMarker status="cancelled" />
            </div>

            {/* Problem Type */}
            <div className="flex flex-col justify-center items-center w-[11.25rem] h-[3.125rem] py-[0.5rem]">
                <div className="text-black text-center font-sarabun text-[1rem] font-normal leading-[1.2]">
                    Problem Type
                </div>
            </div>

            {/* Submitted */}
            <div className="flex flex-col justify-center items-center w-[11.25rem] h-[3.125rem] py-[0.5rem]">
                <div className="text-black text-center font-sarabun text-[1rem] font-normal leading-[1.2]">
                    2025-08-06 19:32:10
                </div>
            </div>

            {/* Last Update */}
            <div className="flex flex-col justify-center items-center w-[11.25rem] h-[3.125rem] py-[0.5rem]">
                <div className="text-black text-center font-sarabun text-[1rem] font-normal leading-[1.2]">
                    2025-08-11 08:30:09
                </div>
            </div>

            {/* Modal */}
            <div className="flex flex-col justify-center items-center w-[5.625rem] h-[3.125rem] py-[0.5rem]">
                
            </div>
        </div>
    );
}
