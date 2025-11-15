"use client";

import { useEffect } from "react";
import ErrorState from "./ErrorState";

interface BookingErrorBoundaryProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function BookingErrorBoundary({
    error,
    reset,
}: BookingErrorBoundaryProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Booking error:", error);
    }, [error]);

    return (
        <div className="space-y-4">
            <ErrorState error={error.message} />
            <div className="text-center">
                <button
                    onClick={reset}
                    className="rounded-lg bg-primary-600 px-6 py-3 text-white transition-colors hover:bg-primary-700"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
