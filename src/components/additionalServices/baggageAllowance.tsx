import Image from "next/image";
export default function BaggageAllowance() {
    return (
        <div className="flex w-[44.625rem] px-[1.5rem] py-[0.75rem] flex-col justify-center items-start rounded-[0.5rem] bg-primary-50">
            <div className="flex items-start gap-4 self-stretch">
                <div className="flex w-[9.625rem] h-[9.625rem] p-[0.625rem] flex-col justify-center items-center gap-[0.625rem]">

                </div>
                <div className="flex w-[9.625rem] h-[9.625rem] p-[0.625rem] flex-col justify-center items-center gap-[0.625rem]">
                    <div className="flex w-[3.563rem] h-[3.563rem] px-[0.371rem] py-[0.297rem] justify-center items-center shrink-0 aspect-square">
                        <Image
                            src="/additional-services/backpack.svg"
                            alt="Logo"
                            width={57}
                            height={57}
                        />
                    </div>
                    <div className="text-black font-sarabun text-[1rem] not-italic font-normal leading-[1.2]">
                        Personal Item
                    </div>
                </div>
                <div className="flex w-[9.625rem] h-[9.625rem] p-[0.625rem] flex-col justify-center items-center gap-[0.625rem]">
                    <div className="flex w-[3.563rem] h-[3.563rem] px-[0.371rem] py-[0.297rem] justify-center items-center shrink-0 aspect-square">
                        <Image
                            src="/additional-services/carryon-baggage.svg"
                            alt="Logo"
                            width={57}
                            height={57}
                        />
                    </div>
                    <div className="text-black font-sarabun text-[1rem] not-italic font-normal leading-[1.2]">
                        Carry-on Baggage
                    </div>
                </div>
                <div className="flex w-[9.625rem] h-[9.625rem] p-[0.625rem] flex-col justify-center items-center gap-[0.625rem]">
                    <div className="flex w-[3.563rem] h-[3.563rem] px-[0.371rem] py-[0.297rem] justify-center items-center shrink-0 aspect-square">
                        <Image
                            src="/additional-services/checked-baggage.svg"
                            alt="Logo"
                            width={57}
                            height={57}
                        />
                    </div>
                    <div className="text-black font-sarabun text-[1rem] not-italic font-normal leading-[1.2]">
                        Checked Baggage
                    </div>
                </div>
            </div> 
        </div>
    );
}