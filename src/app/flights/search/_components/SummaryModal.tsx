"use client";

import { Dialog } from "@headlessui/react";
import { MappedFlightData } from "../helper";
import SummaryCard from "./SummaryCard";
import { SelectedValues } from "./search";
import addToCart from "@/src/lib/addToCart";
import { useSession } from "next-auth/react";

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
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />

        {/* Modal content */}
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="w-[33%] rounded-lg bg-white shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-primary-400 text-white px-6 py-3 flex justify-between items-center">
              <Dialog.Title className="text-2xl text-white">
                Summary
              </Dialog.Title>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 border-primary-400 border-6">
              <div className="flex justify-between text-lg text-primary-600 font-bold">
                {FlightType} - {ClassType}
              </div>

              {/* Flight Card */}
              <div className="space-y-3 border-primary-400 border-3 rounded-md">
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
                  className="px-4 py-2 rounded-lg border border-primary-400 text-primary-400 bg-white hover:bg-gray-100"
                >
                  Add to Cart
                </button>
                <button className="px-4 py-2 rounded-lg bg-primary-400 text-white hover:bg-primary-600" 
                  onClick={() => {
                    onClose();
                  }}> 
                  Book Now
                </button>
              </div>
            </div>

            
          </Dialog.Panel>
        </div>
      </Dialog>
    );
}
