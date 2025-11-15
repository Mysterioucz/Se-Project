"use client";

import addToCart from "@/src/lib/addToCart";
import { Dialog } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { MappedFlightData } from "../helper";
import SummaryCard from "./SummaryCard";

interface FlightSummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    FlightType: string;
    ClassType: string;
    selectedFlights: MappedFlightData[];
    selectedDates: (Date | null)[];
}

export default function SummaryModal({
    isOpen,
    onClose,
    FlightType,
    ClassType,
    selectedFlights,
    selectedDates,
}: FlightSummaryModalProps) {
    const { data: session } = useSession();
    const router = useRouter();
    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Background overlay */}
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

            {/* Modal content */}
            <div className="fixed inset-0 flex items-center justify-center">
                <Dialog.Panel className="w-[33%] overflow-hidden rounded-lg bg-white shadow-xl">
                    {/* Header */}
                    <div className="bg-primary-400 flex items-center justify-between px-6 py-3 text-white">
                        <Dialog.Title className="text-2xl text-white">
                            Summary
                        </Dialog.Title>
                    </div>

                    {/* Content */}
                    <div className="border-primary-400 space-y-4 border-6 p-6">
                        <div className="text-primary-600 flex justify-between text-lg font-bold">
                            {FlightType} - {ClassType}
                        </div>

                        {/* Flight Card */}
                        <div className="border-primary-400 space-y-3 rounded-md border-3">
                            {selectedFlights.map((flight, idx) => (
                                <SummaryCard
                                    key={idx}
                                    flight={flight}
                                    date={selectedDates[idx]}
                                />
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={(e) => {
                                    if (!session?.user?.id) {
                                        // Redirect to login if no session
                                        window.location.href = "/login";
                                        return;
                                    }

                                    const UserAccountID = session.user.id;
                                    addToCart(selectedFlights, UserAccountID);
                                    onClose();
                                }}
                                className="border-primary-400 text-primary-400 rounded-lg border bg-white px-4 py-2 hover:bg-gray-100"
                            >
                                Add to Cart
                            </button>
                            <button
                                className="bg-primary-400 hover:bg-primary-600 rounded-lg px-4 py-2 text-white"
                                onClick={async () => {
                                    if (!session?.user?.id) {
                                        // Redirect to login if no session
                                        window.location.href = "/login";
                                        return;
                                    }

                                    const UserAccountID = session.user.id;
                                    const res = await addToCart(
                                        selectedFlights,
                                        UserAccountID,
                                    );
                                    const cartID = res.data.ID;
                                    redirect(`/${cartID}/checkout/info`);
                                    onClose();
                                }}
                            >
                                Book Now
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
