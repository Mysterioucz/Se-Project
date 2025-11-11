"use client";

import { MagnifyIcon } from "@/src/components/icons/module";
import { useEffect, useState } from "react";

interface SearchBarProps {
    bookingId: string;
    setBookingId: (id: string) => void;
}

export default function SearchBar({ bookingId, setBookingId }: SearchBarProps) {
    const [localValue, setLocalValue] = useState(bookingId);

    // Sync local value with prop when it changes externally
    useEffect(() => {
        setLocalValue(bookingId);
    }, [bookingId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalValue(value); // Update UI immediately
        setBookingId(value); // Trigger debounced search
    };

    return (
        <div className="flex w-full items-center gap-4 rounded-2xl bg-gray-50 p-3">
            <div className="h-5 w-5 text-gray-300">
                <MagnifyIcon />
            </div>
            <input
                className="w-full bg-gray-50 text-gray-600 outline-none placeholder:text-gray-300"
                value={localValue}
                placeholder="Search by Booking ID"
                onChange={handleChange}
            />
        </div>
    );
}
