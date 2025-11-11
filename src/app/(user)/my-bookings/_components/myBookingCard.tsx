"use client";

import BookingItem from "@/src/components/booking/BookingItem";
import Button from "@/src/components/Button";
import { CartType } from "@/src/enums/CartType";
import { useState } from "react";
import { StatusFilter } from "./Helper";
import BookingItemHeader from "./bookingItemHeader";
import SearchField from "./searchField";
import StatusFilterBar from "./statusFilterBar";

export const cartItems: CartType[] = [
    {
        id: 1,
        FlightType: "Round Trip",
        ClassType: "Economy",
        Adults: 2,
        Childrens: 1,
        Infants: 0,
        Price: 7850,
        DepartureAirport: "BKK",
        ArrivalAirport: "CNX",
        DepartureCity: "Bangkok (Suvarnabhumi)",
        ArrivalCity: "Chiang Mai",
        Depart: {
            FlightNo: "TG102",
            // เราใช้ new Date() เพื่อสร้างข้อมูลวันที่จริงๆ
            DepartTime: new Date("2025-12-10T09:30:00"),
            ArrivalTime: new Date("2025-12-10T10:45:00"),
            AirlineName: "Thai Airways",
            Stops: 0,
        },
        // สำหรับ Round Trip, object "Return" จะต้องมีข้อมูล
        Return: {
            FlightNo: "TG103",
            DepartTime: new Date("2025-12-15T18:00:00"),
            ArrivalTime: new Date("2025-12-15T19:15:00"),
            AirlineName: "Thai Airways",
            Stops: 0,
        },
    },
    {
        id: 2,
        FlightType: "One Way",
        ClassType: "Business",
        Adults: 1,
        Childrens: 0,
        Infants: 0,
        Price: 4200,
        DepartureAirport: "DMK",
        ArrivalAirport: "HKT",
        DepartureCity: "Bangkok (Don Mueang)",
        ArrivalCity: "Phuket",
        Depart: {
            FlightNo: "FD3001",
            DepartTime: new Date("2025-11-25T14:10:00"),
            ArrivalTime: new Date("2025-11-25T16:40:00"), // สมมติว่าใช้เวลา 2.5 ชม. เพราะมี 1 stop
            AirlineName: "AirAsia",
            Stops: 1,
        },
        // สำหรับ One Way, object "Return" จะต้องเป็น null
        Return: null,
    },
];

export default function myBookingCard() {
    // use this for query search (booking id)
    const [searchValue, setSearchValue] = useState("");

    // use this select status filter (all, scheduled, departed, cancelled)
    const [selectedStatus, setSelectedStatus] = useState(StatusFilter.ALL);

    return (
        <div className="flex flex-col px-[2.5rem] gap-[1.5rem] w-full">
            <h2 className="!text-[2.5rem] !font-bold !leading-[3rem] !text-[var(--color-primary-900)]">
                My Bookings
            </h2>
            <div className="flex flex-col gap-6">
                {/* Search-Filter */}
                <div className="flex flex-col gap-2">
                    <SearchField
                        value={searchValue}
                        onChange={setSearchValue}
                    />
                    <StatusFilterBar
                        selectedStatus={selectedStatus}
                        onStatusChange={setSelectedStatus}
                    />
                </div>
                {/* Booking Item List */}
                <div className="lg:col-span-3 rounded-lg p-4 justify-center">
                    {cartItems.length > 0 ? (
                        cartItems.map((item: CartType) => (
                            <div key={item.id} className="flex flex-col">
                                {/* TODO: Implement booking status */}
                                <BookingItemHeader 
                                    bookingID={item.id.toString()}
                                    bookingStatus="Scheduled"
                                />
                                <BookingItem
                                    item={item}
                                    isViewOnly={true}
                                />
                                <div className="pb-6">
                                    <Button
                                        text="View Details"
                                        width="w-full"
                                        onClick={ () => {
                                            // TODO: Navigate to booking details page
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-2xl font-bold rounded-lg bg-primary-50 text-primary-600 my-10">
                            No booking found.
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="text-center text-primary-600">
                            End of My Booking.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
