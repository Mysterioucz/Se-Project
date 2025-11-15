import BookingItem from "@/src/components/booking/BookingItem";
import Button from "@/src/components/Button";
import { CartType } from "@/src/enums/CartType";
import { Booking } from "@/src/lib/bookingHistory";
import BookingItemHeader from "./bookingItemHeader";

interface BookingListProps {
    bookings: Booking[];
}

export default function BookingList({ bookings }: BookingListProps) {
    // Helper function to format status for display
    const formatStatus = (status: string): string => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

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
        <>
            {bookings.map((booking) => {
                const item = transformBookingToCart(booking);
                return (
                    <div key={booking.paymentId}>
                        <BookingItemHeader
                            bookingID={booking.paymentId}
                            bookingStatus={formatStatus(booking.status)}
                        />
                        <BookingItem item={item} isViewOnly={true} />
                        <div className="pb-6">
                            <Button
                                text="View Details"
                                width="w-full"
                                onClick={() => {
                                    // TODO: Navigate to booking details page
                                }}
                            />
                        </div>
                    </div>
                );
            })}
            <div className="text-primary-600 mt-4 text-center">
                End of My Booking.
            </div>
        </>
    );
}
