import { PaymentMethodTypes } from "@/src/enums/PaymentMethodTypes";

interface PaymentDetailSummaryProps {
    bookingId: string;
    paymentMethod: String;
}

export default function PaymentDetailSummary({ bookingId, paymentMethod }: PaymentDetailSummaryProps) {
    return (
        <div className="flex flex-col items-start self-stretch p-4 px-6 gap-4 rounded-md border-[0.125rem] border-primary-300">
            <span className="text-primary-900 font-sarabun text-[1.5rem] font-semibold leading-[1.2]">
                Payment & Booking Details
            </span>
            <div className="flex flex-col justify-center items-start gap-2 text-left pl-6">
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="font-bold text-primary-600">Booking ID : </span>
                    <span className="font-normal text-primary-800">{bookingId}</span>
                </span>
                <span className="font-sarabun text-[1rem] leading-[120%]">
                    <span className="font-bold text-primary-600">Payment Method : </span>
                    <span className="font-normal text-primary-800">{paymentMethod}</span>
                </span>
            </div>
        </div>
    );
}