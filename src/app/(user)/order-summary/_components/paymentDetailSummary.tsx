interface PaymentDetailSummaryProps {
    bookingId: string;
    paymentMethod: string;
}

export default function PaymentDetailSummary({
    bookingId,
    paymentMethod,
}: PaymentDetailSummaryProps) {
    return (
        <div className="border-primary-300 flex flex-col items-start gap-4 self-stretch rounded-md border-[0.125rem] p-4 px-6">
            <span className="text-primary-900 font-sarabun text-[1.5rem] leading-[1.2] font-semibold">
                Payment & Booking Details
            </span>
            <div className="flex flex-col items-start justify-center gap-2 pl-6 text-left">
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="text-primary-600 font-bold">
                        Booking ID :{" "}
                    </span>
                    <span className="text-primary-800 font-normal">
                        {bookingId}
                    </span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="text-primary-600 font-bold">
                        Payment Method :{" "}
                    </span>
                    <span className="text-primary-800 font-normal">
                        {paymentMethod}
                    </span>
                </span>
            </div>
        </div>
    );
}
