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
import Navbar from "@/src/components/Navbar";
import { getSession } from "next-auth/react";

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
    const session = getSession();
    console.log(session);
    return (
        <div className="flex flex-col p-8">
            <FlightCard
                airlineTimeStamp={mockFlightData.airlineTimeStamp}
                priceCabinClass={{
                    ...mockFlightData.priceCabinClass,
                    onClick: () => {},
                }}
            />
            <SelectPassengerPanel
                panelData={panelData}
                onChange={handlePanelDataChange}
            />
        </div>
    );
}
