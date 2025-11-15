"use client";

import { useEffect } from "react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error("My Bookings error:", error);
    }, [error]);

    return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center p-8">
            <div className="w-full max-w-md space-y-4 rounded-lg bg-red-50 p-6 text-center">
                <div className="text-6xl">⚠️</div>
                <h2 className="text-2xl font-bold text-red-600">
                    Something went wrong!
                </h2>
                <p className="text-red-600">
                    {error.message || "Failed to load bookings"}
                </p>
                <button
                    onClick={reset}
                    className="mt-4 rounded-lg bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
