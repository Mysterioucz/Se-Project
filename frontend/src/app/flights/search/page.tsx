import {
    FiBrBookmark,
    FiBrPlane,
    FiBrSettings,
    FiBrUser,
} from "@components/icons/module";
import Footer from "@components/footer/footer";
import Sidebar, { SidebarItem } from "@components/sidebar/sidebar";
import FlightSortTab from "@/src/components/flight_sort/sort";

// test
export default function Page() {
    return (
        <div>
            {/* Example Sidebar Component */}
            <FlightSortTab/>
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
