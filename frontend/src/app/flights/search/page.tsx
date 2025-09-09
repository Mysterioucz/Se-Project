import Footer from '../../../components/footer/footer';


// test
export default function Page() {
    return (
        <div>
            <div>Flight Search</div>
            {/* Example Sidebar Component */}
            {/* <Sidebar>
                <SidebarItem label="Book Flight" href="/flights/search" logo={<img src="/icons/icon_stroke/fi-br-plane.svg" alt="plane" className="w-5 h-5 aspect-square"/>}/>
                <SidebarItem label="My Bookings" href="/bookings" logo={<img src="/icons/icon_stroke/fi-br-bookmark.svg" alt="bookmark" className="w-5 h-5 aspect-square"/>}/>
                <SidebarItem label="Profile" href="/profile" logo={<img src="/icons/icon_stroke/fi-br-user.svg" alt="user" className="w-5 h-5 aspect-square"/>}/>
                <SidebarItem label="Settings" href="/settings" logo={<img src="/icons/icon_stroke/fi-br-settings.svg" alt="settings" className="w-5 h-5 aspect-square"/>}/>
            </Sidebar> */}
            <Footer />
        </div>
    );
}