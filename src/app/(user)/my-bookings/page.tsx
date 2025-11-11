import Sidebar from "@/src/components/sidebar/sidebar";
import Footer from "@components/footer/footer";
import Navbar from "@components/Navbar";
import BookingContainer from "./_components/BookingContainer";
import BookingData from "./_components/BookingData";

export default function MyBookingPage() {
    return (
        <div className="flex h-dvh flex-col">
            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content */}
            <div className="mx-[6.25rem] mt-[1.25rem] flex flex-col gap-[2rem]">
                <h1 className="!font-sans !text-[3rem] !leading-[3rem] !font-bold !text-[var(--color-primary-900)]">
                    Account Management
                </h1>
                <div className="h-fit border-1 border-dashed border-[var(--color-gray-300)]">
                    <div className="flex h-fit items-start gap-[1rem] self-stretch border border-dashed border-[var(--Gray-300,#848B8F)] p-[0.75rem]">
                        <Sidebar />
                        <div className="flex w-full px-[2rem] py-[0.5rem]">
                            <BookingContainer>
                                <BookingData />
                            </BookingContainer>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
