"use client";
import {
    FiBrBookmark,
    FiBrPlane,
    FiBrSettings,
    FiBrUser,
} from "@components/icons/module";
import Footer from "@components/footer/footer";
import Sidebar, { SidebarItem } from "@components/sidebar/sidebar";
import FlightSearchBar from "@/src/components/flight_search/search";
import SelectPassengerPanel, {
    PanelData,
} from "@/src/components/selectPassengerPanel/select_passenger_panel";
import FlightCard from "@/src/components/flightCard/flight_card";
import { mockFlightData } from "@/src/data/mockFlightData";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

export default function Page() {
    const [panelData, setPanelData] = useState<PanelData>({
        adultCount: 1,
        childCount: 0,
        infantCount: 0,
        seatClass: "",
    });

    const handlePanelDataChange = (
        key: keyof PanelData,
        value: number | string
    ) => {
        setPanelData((prev) => ({
            ...prev,
            [key]: value,
        }));
        console.log({ ...panelData, [key]: value });
    };

	const session = useSession();
	console.log("Session:", session);
    return (
        <div className="flex flex-col p-8">
			{/* Logout Example */}
            <button
                className="bg-blue-500 text-white p-2 rounded"
                onClick={() => signOut()}
            >
                Logout
            </button>
        </div>
    );
}
