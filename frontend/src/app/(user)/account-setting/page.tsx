"use client";

import ProfileCard from "@/components/account-setting/ProfileCard";
import Navbar from "@/components/Navbar";

export default function AccountSettingPage() {
    return (
        <div className="flex flex-col h-dvh">
            <div className="mx-[6.25rem] flex flex-col gap-[1rem]">
                <h1 className="text-[3rem] text-[var(--color-primary-900)] font-bold">
                    Account Management
                </h1>
                <div className="h-full border-dashed border-1 border-[var(--color-gray-300)]">
                    <div className="h-full flex divide-x-1 divide-dashed divide-[var(--color-gray-300)] py-[0.50rem]">
                        <div className="flex px-[2rem] py-[0.50rem]">
                            {/* TODO: Replace with Side Bar */}
                            <ul className="flex flex-col w-[18.75rem] h-fit text-[var(--color-common-white)] bg-red-950 gap-[0.75rem]">
                                <li>List #1</li>
                                <li>List #2</li>
                                <li>List #3</li>
                                <li>List #4</li>
                            </ul>
                        </div>
                        <div className="w-full flex px-[2rem] py-[0.50rem] ">
                            <ProfileCard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}