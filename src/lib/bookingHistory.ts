import { TicketStatus } from "../generated/prisma";

export type BookingStatus = "SCHEDULED" | "CANCELLED" | "DEPARTED";
export interface BookingTicket {
    ticketId: string;
    status: TicketStatus;
    passengerName: string;
    passengerLastName: string;
    seatNo: string;
    price: number;
    serviceFee: number;
    flightNo: string;
    departTime: Date;
    arrivalTime: Date;
}

export interface Airport {
    AirportID: string;
    AirportName: string;
    City: string;
    Country: string;
}

export interface BookingFlight {
    flightNo: string;
    departTime: Date;
    arrivalTime: Date;
    departureAirport: Airport;
    arrivalAirport: Airport;
    airlineName: string;
}

export interface Booking {
    paymentId: string;
    paymentDateTime: Date;
    totalAmount: number;
    paymentMethod: string;
    transactionStatus: string;
    status: BookingStatus;
    flightType: string;
    classType: string;
    adults: number;
    childrens: number;
    infants: number;
    departFlight: BookingFlight;
    returnFlight: BookingFlight | null;
    tickets: BookingTicket[];
}

export interface BookingHistoryResponse {
    success: boolean;
    data: {
        bookings: Booking[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
        };
    };
}

export interface GetBookingHistoryParams {
    status?: BookingStatus;
    page?: number;
    limit?: number;
}

/**
 * Get the base URL for API calls
 * Works in both client and server environments
 */
function getBaseUrl(): string {
    // Client-side
    if (typeof window !== "undefined") {
        return "";
    }

    // Server-side - check for environment variables
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }

    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Fallback to localhost
    return "http://localhost:3000";
}

/**
 * Fetch booking history for the authenticated user
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with booking history data
 */
export async function getBookingHistory(
    params: GetBookingHistoryParams = {},
): Promise<BookingHistoryResponse> {
    const { status, page = 1, limit = 10 } = params;

    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const baseUrl = getBaseUrl();
    const url = `${baseUrl}/api/v1/purchase/?${queryParams.toString()}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        cache: "no-store",
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch booking history");
    }

    return await response.json();
}

/**
 * Get all scheduled bookings
 */
export async function getScheduledBookings(page = 1, limit = 10) {
    return getBookingHistory({
        status: "SCHEDULED",
        page,
        limit,
    });
}

/**
 * Get all cancelled bookings
 */
export async function getCancelledBookings(page = 1, limit = 10) {
    return getBookingHistory({
        status: "CANCELLED",
        page,
        limit,
    });
}

/**
 * Get all departed bookings
 */
export async function getDepartedBookings(page = 1, limit = 10) {
    return getBookingHistory({
        status: "DEPARTED",
        page,
        limit,
    });
}
