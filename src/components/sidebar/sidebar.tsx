"use client";

import Button from "@components/Button";
import Link from "next/link";

interface SidebarProps {
    width?: string;
    height?: string;
}

export default function Sidebar({
    width = "250px",
    height = "100%",
}: SidebarProps) {
    return (
        <div className="flex w-[19.1875rem] flex-col items-center self-stretch border-r border-dashed border-[var(--color-gray-300)] px-[1.5rem] py-[2rem] pl-[1rem]">
            <div className="flex flex-col items-start gap-[0.75rem] self-stretch">
                <Link href="/my-bookings">
                    <Button
                        text="My Bookings"
                        iconStart="/buttons/fi-br-calendar.svg"
                        align="left"
                        styleType="stroke"
                        size="md"
                        width="w-[16.6875rem]"
                        height="h-[3rem]"
                    />
                </Link>

                {/*<Link href="/noti-center">*/}
                <Button
                    text="Notification Center"
                    iconStart="/buttons/fi-br-bell.svg"
                    align="left"
                    styleType="stroke"
                    size="md"
                    width="w-[16.6875rem]"
                    height="h-[3rem]"
                />
                {/*</Link>*/}

                <Link href="/account-setting">
                    <Button
                        text="Account Setting"
                        iconStart="/buttons/fi-sr-settings.svg"
                        align="left"
                        styleType="stroke"
                        size="md"
                        width="w-[16.6875rem]"
                        height="h-[3rem]"
                        onClick={() => console.log("Account Setting clicked")}
                    />
                </Link>

                {/*<Link href="/priv-sec">*/}
                <Button
                    text="Privacy & Security"
                    iconStart="/buttons/fi-br-eye.svg"
                    align="left"
                    styleType="stroke"
                    size="md"
                    width="w-[16.6875rem]"
                    height="h-[3rem]"
                    onClick={() => console.log("Privacy & Security clicked")}
                />
                {/*</Link>*/}
            </div>
        </div>
    );
}
