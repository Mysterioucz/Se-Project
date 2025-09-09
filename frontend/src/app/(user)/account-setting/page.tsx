"use client";

import ProfileCard from "@/components/account-setting/ProfileCard";
import Sidebar from "@/components/sidebar/sidebar";
import ItemComponent from "@/components/item";
import Footer from '../../../components/footer/footer';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountSettingPage() {
    return (
        <div className="flex flex-col h-dvh">
            {/* TODO: Replace with Navigation Bar */}
            <div className="flex mb-[1.125rem] sticky top-0 z-99 bg-blue-950 text-common-white w-full h-20 items-center justify-center">
                Nav Bar
            </div>

            <div className="mx-[6.25rem] flex flex-col gap-[1rem]">
                <h1 className="text-[3rem] text-[var(--color-primary-900)] font-bold">
                    Account Management
                </h1>
                <div className="h-full border-dashed border-1 border-[var(--color-gray-300)]">
                    <div className="h-full flex divide-x-1 divide-dashed divide-[var(--color-gray-300)] py-[0.50rem]">
                        <div className="flex px-[2rem] py-[0.50rem]">
                            <Sidebar>
                                <ItemComponent prefix={<></>} label="My Bookings" onClick={() => console.log("My Bookings clicked")} />
                                <ItemComponent prefix={<></>} label="Notification Center" onClick={() => console.log("Notification Center clicked")} />
                                <ItemComponent prefix={<></>} label="Account Setting" onClick={() => console.log("Account Setting clicked")} />
                                <ItemComponent prefix={<></>} label="Privacy & Security" onClick={() => console.log("Privacy & Security clicked")} />
                            </Sidebar>
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