import {
    getBookingHistory,
    getCancelledBookings,
    getDepartedBookings,
    getScheduledBookings,
} from "@/src/lib/bookingHistory";

// Example 1: Get all bookings (no filter)
async function getAllBookings() {
    try {
        const result = await getBookingHistory();
        console.log("All bookings:", result.data.bookings);
        console.log("Pagination:", result.data.pagination);
    } catch (error) {
        console.error("Error fetching bookings:", error);
    }
}

// Example 2: Get only scheduled bookings
async function getScheduledOnly() {
    try {
        const result = await getScheduledBookings(1, 10);
        console.log("Scheduled bookings:", result.data.bookings);
    } catch (error) {
        console.error("Error fetching scheduled bookings:", error);
    }
}

// Example 3: Get cancelled bookings with pagination
async function getCancelledWithPagination() {
    try {
        const page = 2;
        const limit = 5;
        const result = await getCancelledBookings(page, limit);

        console.log(
            `Page ${result.data.pagination.currentPage} of ${result.data.pagination.totalPages}`,
        );
        console.log(
            `Showing ${result.data.bookings.length} of ${result.data.pagination.totalItems} cancelled bookings`,
        );
    } catch (error) {
        console.error("Error fetching cancelled bookings:", error);
    }
}

// Example 4: Get departed bookings
async function getDepartedOnly() {
    try {
        const result = await getDepartedBookings();
        console.log("Departed bookings:", result.data.bookings);
    } catch (error) {
        console.error("Error fetching departed bookings:", error);
    }
}

// Example 5: Filter bookings by status with custom pagination
async function getBookingsByStatus() {
    try {
        const result = await getBookingHistory({
            status: "SCHEDULED",
            page: 1,
            limit: 20,
        });

        result.data.bookings.forEach((booking) => {
            console.log(`Booking ${booking.paymentId}:`);
            console.log(`  Flight Type: ${booking.flightType}`);
            console.log(
                `  Depart: ${booking.departFlight.flightNo} - ${booking.departFlight.departureAirport} to ${booking.departFlight.arrivalAirport}`,
            );
            if (booking.returnFlight) {
                console.log(
                    `  Return: ${booking.returnFlight.flightNo} - ${booking.returnFlight.departureAirport} to ${booking.returnFlight.arrivalAirport}`,
                );
            }
            console.log(`  Tickets: ${booking.tickets.length} passenger(s)`);
            booking.tickets.forEach((ticket) => {
                console.log(
                    `    - ${ticket.passengerName} ${ticket.passengerLastName} (${ticket.status})`,
                );
            });
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Example 6: React component usage
/*
import { useState, useEffect } from 'react';
import { getBookingHistory, Booking } from '@/src/lib/bookingHistory';

export function BookingHistoryPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [status, setStatus] = useState<'SCHEDULED' | 'CANCELLED' | 'DEPARTED' | undefined>();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchBookings() {
            setLoading(true);
            try {
                const result = await getBookingHistory({ status, page, limit: 10 });
                setBookings(result.data.bookings);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchBookings();
    }, [status, page]);

    return (
        <div>
            <select value={status || ''} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="">All Bookings</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="DEPARTED">Departed</option>
            </select>
            
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking.paymentId}>
                            {booking.departFlight.flightNo} - {booking.flightType}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
*/

// API Endpoint Examples:
// GET /api/v1/bookings - Get all bookings
// GET /api/v1/bookings?status=SCHEDULED - Get only scheduled bookings
// GET /api/v1/bookings?status=CANCELLED&page=2&limit=5 - Get cancelled bookings with pagination
// GET /api/v1/bookings?status=DEPARTED - Get only departed bookings

export {
    getAllBookings,
    getBookingsByStatus,
    getCancelledWithPagination,
    getDepartedOnly,
    getScheduledOnly,
};
