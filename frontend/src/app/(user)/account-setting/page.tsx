"use client";

import ProfileCard from "@/components/account-setting/ProfileCard";
import Sidebar from "@/components/sidebar/sidebar";
import ItemComponent from "@/components/item";
import Footer from '../../../components/footer/footer';
import Button from "@/components/Button";
import Navbar from "@/components/Navbar";

export default function AccountSettingPage() {
    return (
        <div className="flex flex-col h-dvh">
            {/* Navigation Bar */}
            <Navbar isSignIn={true} displayName="John Doe" />

            {/* Main Content */}
            <div className="mx-[6.25rem] flex flex-col gap-[1rem]">
                <h1 className="font-sans text-[2.5rem] font-bold leading-[3rem] text-[var(--color-Primary-900)]">
                    Account Management
                </h1>
                <div className="h-full border-dashed border-1 border-[var(--color-gray-300)]">
                    <div className="flex h-[711px] p-[12px] items-start gap-[16px] self-stretch border border-dashed border-[var(--Gray-300,#848B8F)]">
                        <div className="flex flex-col w-[307px] px-[24px] py-[32px] pl-[16px] items-center self-stretch border-r border-dashed border-[var(--Gray-300,#848B8F)]">
                            <div className="flex flex-col items-start gap-[12px] self-stretch">
                                <Button text="My Bookings" iconStart="/buttons/fi-br-calendar.svg" align="left" styleType="stroke" size="sm" width="w-[267px]" height="h-[36px]" onClick={() => console.log("Edit Profile clicked")} />
                                <Button text="Notification Center" iconStart="/buttons/fi-br-bell.svg" align="left" styleType="stroke" size="sm" width="w-[267px]" height="h-[36px]" onClick={() => console.log("Notification Center clicked")} />
                                <Button text="Account Setting" iconStart="/buttons/fi-sr-settings.svg" align="left" styleType="stroke" size="sm" width="w-[267px]" height="h-[36px]" onClick={() => console.log("Account Setting clicked")} />
                                <Button text="Privacy & Security" iconStart="/buttons/fi-br-eye.svg" align="left" styleType="stroke" size="sm" width="w-[267px]" height="h-[36px]" onClick={() => console.log("Privacy & Security clicked")} />
                            </div>
                        </div>
                        <div className="w-full flex px-[2rem] py-[0.50rem] ">
                            <ProfileCard />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}