import { TicketStatus } from "../generated/prisma";

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

export interface BookingFlight {
    flightNo: string;
    departTime: Date;
    arrivalTime: Date;
    departureAirport: string;
    arrivalAirport: string;
    airlineName: string;
}

export interface Booking {
    paymentId: string;
    paymentDateTime: Date;
    totalAmount: number;
    paymentMethod: string;
    transactionStatus: string;
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
    status?: "SCHEDULED" | "CANCELLED" | "DEPARTED";
    page?: number;
    limit?: number;
}

/**
 * Fetch booking history for the authenticated user
 * @param userAccountId - User account ID
 * @param params - Query parameters for filtering and pagination
 * @returns Promise with booking history data
 */
export async function getBookingHistory(
    userAccountId: string,
    params: GetBookingHistoryParams = {},
): Promise<BookingHistoryResponse> {
    const { status, page = 1, limit = 10 } = params;

    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    const response = await fetch(
        `/api/v1/purchase/${userAccountId}?${queryParams.toString()}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            cache: "no-store",
        },
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch booking history");
    }

    return await response.json();
}

/**
 * Get all scheduled bookings
 */
export async function getScheduledBookings(
    userAccountId: string,
    page = 1,
    limit = 10,
) {
    return getBookingHistory(userAccountId, {
        status: "SCHEDULED",
        page,
        limit,
    });
}

/**
 * Get all cancelled bookings
 */
export async function getCancelledBookings(
    userAccountId: string,
    page = 1,
    limit = 10,
) {
    return getBookingHistory(userAccountId, {
        status: "CANCELLED",
        page,
        limit,
    });
}

/**
 * Get all departed bookings
 */
export async function getDepartedBookings(
    userAccountId: string,
    page = 1,
    limit = 10,
) {
    return getBookingHistory(userAccountId, {
        status: "DEPARTED",
        page,
        limit,
    });
}
