"use client";

import { BookingStatus } from "@/src/lib/bookingHistory";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useRef, useTransition } from "react";
import FilterBar from "./filterBar";
import SearchBar from "./searchBar";

interface BookingContainerProps {
    children: ReactNode;
}

export default function BookingContainer({ children }: BookingContainerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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

    const debouncedUpdateSearchParams = (
        key: string,
        value: string,
        delay: number = 500,
    ) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            startTransition(() => {
                const params = new URLSearchParams(searchParams.toString());
                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
                router.push(`?${params.toString()}`);
            });
        }, delay);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const setBookingId = (id: string) => {
        debouncedUpdateSearchParams("bookingId", id, 500);
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

                <div className="rounded-lg p-3 lg:col-span-3">{children}</div>
            </div>
        </div>
    );
}
