"use client";

import { BookingStatus } from "@/src/lib/bookingHistory";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useTransition } from "react";
import FilterBar from "./filterBar";
import SearchBar from "./searchBar";

interface BookingContainerProps {
    children: ReactNode;
}

export default function BookingContainer({ children }: BookingContainerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const bookingId = searchParams.get("bookingId") || "";
    const statusFilter =
        (searchParams.get("status") as BookingStatus) || "SCHEDULED";

    const updateSearchParams = (key: string, value: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            router.push(`?${params.toString()}`);
        });
    };

    const setBookingId = (id: string) => {
        updateSearchParams("bookingId", id);
    };

    const setStatus = (status: BookingStatus) => {
        updateSearchParams("status", status);
    };

    return (
        <div className="flex w-full flex-col gap-[1.5rem] px-[2.5rem]">
            <h2 className="!text-[2.5rem] !leading-[3rem] !font-bold !text-[var(--color-primary-900)]">
                My Bookings
            </h2>

            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <SearchBar
                        bookingId={bookingId}
                        setBookingId={setBookingId}
                    />
                    <FilterBar
                        selectedStatus={statusFilter}
                        setStatus={setStatus}
                    />
                </div>

                <div className="bg-primary-50 rounded-lg p-3 lg:col-span-3">
                    {children}
                </div>
            </div>
        </div>
    );
}
