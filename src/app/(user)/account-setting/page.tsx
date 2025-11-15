"use client";

import ProfileCard from "@/src/app/(user)/account-setting/_components/ProfileCard";
import Sidebar from "@/src/components/sidebar/sidebar";
import Footer from "@components/footer/footer";
import Navbar from "@components/Navbar";

export default function AccountSettingPage() {
    return (
        <div className="flex flex-col h-dvh">
            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content */}
            <div className="mx-[6.25rem] mt-[1.25rem] flex flex-col gap-[2rem]">
                <h1 className="!font-sans !text-[3rem] !font-bold !leading-[3rem] !text-[var(--color-primary-900)]">
                    Account Management
                </h1>
                <div className="h-fit border-dashed border-1 border-[var(--color-gray-300)]">
                    <div className="flex h-fit p-[0.75rem] items-start gap-[1rem] self-stretch border border-dashed border-[var(--Gray-300,#848B8F)]">
                        <Sidebar/>
                        <div className="w-full flex px-[2rem] py-[0.5rem] ">
                            <ProfileCard />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
