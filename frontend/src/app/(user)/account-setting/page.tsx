"use client";

import ProfileCard from '@/src/components/account-setting/ProfileCard';
import Footer from '../../../components/footer/footer';
import Button from "@/src/components/Button";
import Navbar from "@/src/components/Navbar";

export default function AccountSettingPage() {
    return (
        <div className="flex flex-col h-dvh">
            {/* Navigation Bar */}
            <Navbar displayName="John Doe" />

            {/* Main Content */}
            <div className="mx-[6.25rem] flex flex-col gap-[1rem]">
                <h1 className="font-sans text-[2.5rem] font-bold leading-[3rem] text-[var(--color-Primary-900)]">
                    Account Management
                </h1>
                <div className="h-full border-dashed border-1 border-[var(--color-gray-300)]">
                    <div className="flex h-[44.4375rem] p-[0.75rem] items-start gap-[1rem] self-stretch border border-dashed border-[var(--Gray-300,#848B8F)]">
                        <div className="flex flex-col w-[19.1875rem] px-[1.5rem] py-[2rem] pl-[1rem] items-center self-stretch border-r border-dashed border-[var(--Gray-300,#848B8F)]">
                            <div className="flex flex-col items-start gap-[0.75rem] self-stretch">
                                <Button text="My Bookings" iconStart="/buttons/fi-br-calendar.svg" align="left" styleType="stroke" size="sm" width="w-[16.6875rem]" height="h-[2.25rem]" onClick={() => console.log("Edit Profile clicked")} />
                                <Button text="Notification Center" iconStart="/buttons/fi-br-bell.svg" align="left" styleType="stroke" size="sm" width="w-[16.6875rem]" height="h-[2.25rem]" onClick={() => console.log("Notification Center clicked")} />
                                <Button text="Account Setting" iconStart="/buttons/fi-sr-settings.svg" align="left" styleType="stroke" size="sm" width="w-[16.6875rem]" height="h-[2.25rem]" onClick={() => console.log("Account Setting clicked")} />
                                <Button text="Privacy & Security" iconStart="/buttons/fi-br-eye.svg" align="left" styleType="stroke" size="sm" width="w-[16.6875rem]" height="h-[2.25rem]" onClick={() => console.log("Privacy & Security clicked")} />
                            </div>
                        </div>
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