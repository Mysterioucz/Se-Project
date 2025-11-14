"use client";

import Button from "@/src/components/Button";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function AdminNavBar() {
    const { data: session, status } = useSession();
    return (
        <nav className="bg-primary-400 sticky top-0 z-99 flex w-full items-center justify-between px-[2rem] py-[0.5rem]">
            {/* Navigate to main page */}
            <Link href="/dashboard">
                <Image
                    src={"/logo/logo_nobg_white.svg"}
                    alt="White Logo"
                    width={50}
                    height={50}
                    className="h-[3.125rem] w-[3.125rem]"
                />
            </Link>
            <div className="flex items-center gap-[2rem]">
                {status === "authenticated" ? (
                    <Button
                        text={"Signout"}
                        styleType="stroke"
                        size="md"
                        onClick={signOut}
                    />
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
