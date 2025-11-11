"use client";

import {
    Booking,
    BookingStatus,
    getBookingHistory,
} from "@/src/lib/bookingHistory";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookingList from "./BookingList";
import EmptyState from "./EmptyState";
import ErrorState from "./ErrorState";
import LoadingSkeleton from "./LoadingSkeleton";

export default function BookingData() {
    const searchParams = useSearchParams();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const status = (searchParams.get("status") as BookingStatus) || "SCHEDULED";
    const bookingId = searchParams.get("bookingId") || "";

    useEffect(() => {
        const fetchBookings = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await getBookingHistory({
                    status,
                    page: 1,
                    limit: 10,
                });

                if (!response.success) {
                    throw new Error("Failed to fetch booking history");
                }

                setBookings(response.data.bookings);
            } catch (err) {
                console.error("Error fetching bookings:", err);
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch booking history",
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, [status]);

    // Show loading state
    if (isLoading) {
        return <LoadingSkeleton />;
    }

    // Show error state
    if (error) {
        return <ErrorState error={error} />;
    }

    // Filter by bookingId if provided
    const filteredBookings = bookingId
        ? bookings.filter((booking) =>
              booking.paymentId.toLowerCase().includes(bookingId.toLowerCase()),
          )
        : bookings;

    // Show empty state
    if (filteredBookings.length === 0) {
        return <EmptyState />;
    }

    // Show bookings
    return <BookingList bookings={filteredBookings} />;
}
