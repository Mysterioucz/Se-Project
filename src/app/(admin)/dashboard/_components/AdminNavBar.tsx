"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "@/src/components/Button";
import { useSession } from "next-auth/react";

export default function AdminNavBar() {
    const { data: session, status } = useSession();
    const displayName = session?.user?.name;
    const AccountID = session?.user.id;
    return (
        <nav className="bg-primary-400 flex items-center w-full justify-between py-[0.5rem] px-[2rem] sticky top-0 z-99">
            {/* Navigate to main page */}
            <Link href="/">
                <Image
                    src={"/logo/logo_nobg_white.svg"}
                    alt="White Logo"
                    width={50}
                    height={50}
                    className="w-[3.125rem] h-[3.125rem]"
                />
            </Link>
            <div className="flex items-center gap-[2rem]">                
                {status === "authenticated" ? (
                    <Link href={"/account-setting"}>
                        <Button
                            //TODO: change to display name when the problem of editing profile name resolved
                            text={"Profile"}
                            styleType="stroke"
                            size="md"
                            iconStart="/navbar/fi-sr-user.svg"
                        />
                    </Link>
                ) : (
                    <Link href={"/login"}>
                        <Button
                            text="Sign in / Register"
                            styleType="stroke"
                            size="md"
                            iconStart="/navbar/fi-sr-user.svg"
                        />
                    </Link>
                )}
            </div>
        </nav>
    );
}
