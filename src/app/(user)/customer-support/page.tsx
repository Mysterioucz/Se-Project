import Navbar from "@/src/components/Navbar";
import ContactUs from "./_component/ContactUs";
import ResponseTime from "./_component/ResponseTime";

export default function Page() {
    return (
        <div className="flex flex-col h-dvh">
            <Navbar />
            {/* Main content */}
            <div className="mx-[6.25rem] mt-[1.25rem] flex flex-col gap-[2rem]">
                {/* Header */}
                <div className="flex flex-col gap-[1rem]">
                    <h1 className="text-[3rem] font-bold leading-[3rem] text-[var(--color-primary-900)] pt-4">
                        Customer Support
                    </h1>
                    <p className="text-[1rem] text-[var(--color-primary-600)]">
                        How can we help you ?
                    </p>
                </div>
                {/* Content */}
                <div className="flex gap-[2rem]">
                    {/* Right: Fill Info */}
                    <div className="grow-[5] basis-0 flex flex-col gap-[1.5rem] border-2 border-solid">

                    </div>
                    {/* Left: Display our Info */}
                    <div className="grow-[2] basis-0 flex flex-col gap-[2rem] h-fit">
                        {/* Contact Us */}
                        <ContactUs />
                        {/* Response Time */}
                        <ResponseTime />
                    </div>
                </div>
            </div>
        </div>
    );
}