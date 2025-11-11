import CopySvg from "@components/icons/copy.svg";
import StatusElement from "./statusElement";

interface BookingItemHeaderProps {
    bookingID: string;
    bookingStatus: string;
}

export default function BookingItemHeader({
    bookingID,
    bookingStatus,
}: BookingItemHeaderProps) {
    return (
        <div className="flex justify-between items-end pb-4">
            <div className="flex flex-row items-center gap-4">
                <p className="text-[0.875rem] text-gray-400">Booking ID:</p>
                <p className="text-[0.875rem] text-primary-300">{bookingID}</p>
                <div 
                    className="cursor-pointer" 
                    onClick={() => {
                        navigator.clipboard.writeText(bookingID);
                        // TODO: Chat, You might want to replace this with a more user-friendly notification
                        alert("Booking ID copied to clipboard");
                    }}
                >
                    <CopySvg />
                </div>
            </div>
            <StatusElement status={bookingStatus} />
        </div>
    );
}
