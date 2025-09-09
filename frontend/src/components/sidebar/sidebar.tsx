import Link from "next/link";
import React, { ReactNode } from "react";

interface SidebarItemProps {
    logo?: ReactNode;
    label?: string;
    href?: string;
}

export function SidebarItem({ logo, label, href = "#" }: SidebarItemProps) {
    return (
        <Link href={href}>
            <div className="flex flex-col justify-center items-start gap-4 p-4 self-stretch rounded-sm bg-white hover:bg-gray-100 cursor-pointer">
                <div className="flex justify-center items-center gap-2.5 self-stretch">
                    {logo && (
                        <div className="w-5 h-5 aspect-square">{logo}</div>
                    )}
                    {label && (
                        <span className="text-[#022B39] font-sarabun text-[16px] font-normal leading-[120%]">
                            {label}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

interface SidebarProps {
    children?: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
    return (
        <div className="flex flex-col items-start w-[250px] p-6 gap-2 rounded-sm bg-white">
            {children}
        </div>
    );
}
