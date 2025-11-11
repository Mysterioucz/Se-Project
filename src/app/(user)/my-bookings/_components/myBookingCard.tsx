import BookingItem from "@/src/components/booking/BookingItem";
import { CartType } from "@/src/enums/CartType";
import {
    Booking,
    BookingStatus,
    getBookingHistory,
} from "@/src/lib/bookingHistory";
import { useEffect, useState } from "react";
import FilterBar from "./filterBar";
import SearchBar from "./searchBar";

export const initialCartItems: Booking[] = [
    {
        paymentId: "1",
        paymentDateTime: new Date("2025-12-10T08:00:00"),
        totalAmount: 7850,
        paymentMethod: "Credit Card",
        transactionStatus: "COMPLETED",
        flightType: "Round Trip",
        classType: "Economy",
        adults: 2,
        childrens: 1,
        infants: 0,
        departFlight: {
            flightNo: "TG102",
            departTime: new Date("2025-12-10T09:30:00"),
            arrivalTime: new Date("2025-12-10T10:45:00"),
            departureAirport: {
                AirportID: "BKK",
                AirportName: "Suvarnabhumi Airport",
                City: "Bangkok",
                Country: "Thailand",
            },
            arrivalAirport: {
                AirportID: "CNX",
                AirportName: "Chiang Mai International Airport",
                City: "Chiang Mai",
                Country: "Thailand",
            },
            airlineName: "Thai Airways",
        },
        returnFlight: {
            flightNo: "TG103",
            departTime: new Date("2025-12-15T18:00:00"),
            arrivalTime: new Date("2025-12-15T19:15:00"),
            departureAirport: {
                AirportID: "CNX",
                AirportName: "Chiang Mai International Airport",
                City: "Chiang Mai",
                Country: "Thailand",
            },
            arrivalAirport: {
                AirportID: "BKK",
                AirportName: "Suvarnabhumi Airport",
                City: "Bangkok",
                Country: "Thailand",
            },
            airlineName: "Thai Airways",
        },
        tickets: [
            {
                ticketId: "T001",
                status: "SCHEDULED",
                passengerName: "John",
                passengerLastName: "Doe",
                seatNo: "12A",
                price: 3925,
                serviceFee: 100,
                flightNo: "TG102",
                departTime: new Date("2025-12-10T09:30:00"),
                arrivalTime: new Date("2025-12-10T10:45:00"),
            },
            {
                ticketId: "T002",
                status: "SCHEDULED",
                passengerName: "Jane",
                passengerLastName: "Doe",
                seatNo: "12B",
                price: 3925,
                serviceFee: 100,
                flightNo: "TG102",
                departTime: new Date("2025-12-10T09:30:00"),
                arrivalTime: new Date("2025-12-10T10:45:00"),
            },
        ],
    },
    {
        paymentId: "2",
        paymentDateTime: new Date("2025-11-20T10:30:00"),
        totalAmount: 4200,
        paymentMethod: "Debit Card",
        transactionStatus: "COMPLETED",
        flightType: "One Way",
        classType: "Business",
        adults: 1,
        childrens: 0,
        infants: 0,
        departFlight: {
            flightNo: "FD3001",
            departTime: new Date("2025-11-25T14:10:00"),
            arrivalTime: new Date("2025-11-25T16:40:00"),
            departureAirport: {
                AirportID: "DMK",
                AirportName: "Don Mueang International Airport",
                City: "Bangkok",
                Country: "Thailand",
            },
            arrivalAirport: {
                AirportID: "HKT",
                AirportName: "Phuket International Airport",
                City: "Phuket",
                Country: "Thailand",
            },
            airlineName: "AirAsia",
        },
        returnFlight: null,
        tickets: [
            {
                ticketId: "T003",
                status: "SCHEDULED",
                passengerName: "Michael",
                passengerLastName: "Smith",
                seatNo: "3C",
                price: 4200,
                serviceFee: 150,
                flightNo: "FD3001",
                departTime: new Date("2025-11-25T14:10:00"),
                arrivalTime: new Date("2025-11-25T16:40:00"),
            },
        ],
    },
];

export default function myBookingCard() {
    const [bookingId, setBookingId] = useState<string>("");
    const [statusFilter, setStatusFilter] =
        useState<BookingStatus>("SCHEDULED");
    const [cartItems, setCartItems] = useState<Booking[]>(initialCartItems);

    useEffect(() => {
        const fetchBookingHistory = async () => {
            try {
                const response = await getBookingHistory({
                    status: statusFilter,
                    page: 1,
                    limit: 10,
                });
                if (response.success) {
                    setCartItems(response.data.bookings);
                }
            } catch (e) {
                console.error("Failed to fetch booking history:", e);
            }
        };
        fetchBookingHistory();
    }, [statusFilter, bookingId]);

    // Transform Booking to CartType for BookingItem component
    const transformBookingToCart = (booking: Booking): CartType => {
        return {
            id: parseInt(booking.paymentId),
            FlightType: booking.flightType,
            ClassType: booking.classType,
            Adults: booking.adults,
            Childrens: booking.childrens,
            Infants: booking.infants,
            Price: booking.totalAmount,
            DepartureAirport: booking.departFlight.departureAirport.AirportID,
            ArrivalAirport: booking.departFlight.arrivalAirport.AirportID,
            DepartureCity: `${booking.departFlight.departureAirport.City} (${booking.departFlight.departureAirport.AirportName})`,
            ArrivalCity: `${booking.departFlight.arrivalAirport.City} (${booking.departFlight.arrivalAirport.AirportName})`,
            Depart: {
                FlightNo: booking.departFlight.flightNo,
                DepartTime: booking.departFlight.departTime,
                ArrivalTime: booking.departFlight.arrivalTime,
                AirlineName: booking.departFlight.airlineName,
                Stops: 0,
            },
            Return: booking.returnFlight
                ? {
                      FlightNo: booking.returnFlight.flightNo,
                      DepartTime: booking.returnFlight.departTime,
                      ArrivalTime: booking.returnFlight.arrivalTime,
                      AirlineName: booking.returnFlight.airlineName,
                      Stops: 0,
                  }
                : null,
        };
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
                        setStatus={setStatusFilter}
                    />
                </div>

                <div className="bg-primary-50 rounded-lg p-3 lg:col-span-3">
                    {cartItems.length > 0 ? (
                        cartItems.map((booking) => {
                            const item = transformBookingToCart(booking);
                            return (
                                <BookingItem
                                    key={booking.paymentId}
                                    item={item}
                                    isViewOnly={true}
                                />
                            );
                        })
                    ) : (
                        <div className="bg-primary-50 text-primary-600 my-10 rounded-lg text-center text-2xl font-bold">
                            No booking found.
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="text-primary-600 mt-4 text-center">
                            End of My Booking.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
