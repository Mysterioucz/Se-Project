import {
    FiBrBookmark,
    FiBrPlane,
    FiBrSettings,
    FiBrUser,
} from "@components/icons/module";
import Footer from "@components/footer/footer";
import Sidebar, { SidebarItem } from "@components/sidebar/sidebar";
import FlightSearchBar from "@/src/components/flight_search/search";

// test
export default function Page() {
    return (
        <div>
            <FlightSearchBar headerText="Select flight informations"/>
            {/* Example Sidebar Component */}
            <Sidebar>
                <SidebarItem
                    label="Book Flight"
                    href="/flights/search"
                    logo={<FiBrPlane className="w-5 h-5 aspect-square" />}
                />
                <SidebarItem
                    label="My Bookings"
                    href="/bookings"
                    logo={<FiBrBookmark className="w-5 h-5 aspect-square" />}
                />
                <SidebarItem
                    label="Profile"
                    href="/profile"
                    logo={<FiBrUser className="w-5 h-5 aspect-square" />}
                />
                <SidebarItem
                    label="Settings"
                    href="/settings"
                    logo={<FiBrSettings className="w-5 h-5 aspect-square" />}
                />
            </Sidebar>
            <Footer />
        </div>
    );
}
