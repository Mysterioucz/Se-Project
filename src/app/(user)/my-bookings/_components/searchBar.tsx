"use client";

import { MagnifyIcon } from "@/src/components/icons/module";

interface SearchBarProps {
    bookingId: string;
    setBookingId: (id: string) => void;
}

export default function SearchBar({ bookingId, setBookingId }: SearchBarProps) {
    return (
        <div className="flex w-full items-center gap-4 rounded-2xl bg-gray-50 p-3">
            <div className="h-5 w-5 text-gray-300">
                <MagnifyIcon />
            </div>
            <input
                className="w-full bg-gray-50 text-gray-600 outline-none placeholder:text-gray-300"
                value={bookingId}
                placeholder="Search by Booking ID"
                onChange={(e) => setBookingId(e.target.value)}
            />
        </div>
    );
}
