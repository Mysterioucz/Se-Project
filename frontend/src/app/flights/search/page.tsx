import {
    FiBrBookmark,
    FiBrPlane,
    FiBrSettings,
    FiBrUser,
} from "@components/icons/module";
import Footer from "@components/footer/footer";
import Sidebar, { SidebarItem } from "@components/sidebar/sidebar";
import FlightSearchBar from "@/src/components/flight_search/search";

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

    return (
        <div className="flex flex-col p-8">
            <FlightCard
                airlineTimeStamp={mockFlightData.airlineTimeStamp}
                priceCabinClass={{
                    ...mockFlightData.priceCabinClass,
                    onClick: () => {},
                }}
            />
            <SelectPassengerPanel panelData={panelData} onChange={handlePanelDataChange} />
        </div>
    );
}
