"use client";
import { useSession } from "next-auth/react";
import AdminNavBar from "./_components/AdminNavBar";
import ReportManagement from "./_components/ReportManagement";

export default function Page() {
    const { data: session } = useSession();
    const displayName = session?.user?.name;
    return (
        <div className="flex flex-col w-full justify-center gap-10 py-md">
            <AdminNavBar />
            <div className="flex flex-col items-start self-stretch px-[var(--Spacing-xxxxl,128px)] gap-[var(--Spacing-sm-md,12px)]">
                <div className="text-primary-900 font-sarabun text-[48px] font-bold leading-[120%] not-italic">
                    Welcome Back, {displayName}
                </div>
                <ReportManagement />
            </div>
        </div>
    );
}
