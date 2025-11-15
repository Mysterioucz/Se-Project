export default function StatusElement({ status }: { status: string }) {
    return (
        <div className={`flex rounded-2xl py-1 px-3 text-white font-semibold text-[1.125rem] 
            ${status === "Scheduled" ? "bg-warning-main" : 
            status === "Departed" ? "bg-success-main" :  
            status === "Cancelled" ? "bg-error-main" : "bg-gray-500"}`}
        >
            {status}
        </div>
    );
}