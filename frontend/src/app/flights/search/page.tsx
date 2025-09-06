"use client";
import Footer from '../../../components/footer/footer';
import Sidebar, { SidebarItem } from "../../../components/sidebar/sidebar";
import BasicSelect from '../../../components/select/select';
import { useState } from 'react';


// test
export default function Page() {
    const [age, setAge] = useState('');
    const [error, setError] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const [name, setName] = useState('');
    const [error1, setError1] = useState(false);
    const [disabled1, setDisabled1] = useState(false);

    return (
        <div>
            <div>Flight Search</div>
            {/* Example Sidebar Component */}
            <Sidebar>
                <SidebarItem label="Book Flight" href="/flights/search" logo={<img src="/icons/icon_stroke/fi-br-plane.svg" alt="plane" className="w-5 h-5 aspect-square"/>}/>
                <SidebarItem label="My Bookings" href="/bookings" logo={<img src="/icons/icon_stroke/fi-br-bookmark.svg" alt="bookmark" className="w-5 h-5 aspect-square"/>}/>
                <SidebarItem label="Profile" href="/profile" logo={<img src="/icons/icon_stroke/fi-br-user.svg" alt="user" className="w-5 h-5 aspect-square"/>}/>
                <SidebarItem label="Settings" href="/settings" logo={<img src="/icons/icon_stroke/fi-br-settings.svg" alt="settings" className="w-5 h-5 aspect-square"/>}/>
            </Sidebar>
            {/* Example Select Compoonent */}
            <div className="flex flex-col p-4 items-center gap-3">
                <BasicSelect
                label="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                options={[
                    { label: "Ten", value: "10" },
                    { label: "Twenty", value: "20" },
                    { label: "Thirty", value: "30" },
                ]}
                state={error ? "error" : disabled ? "disabled" : "enabled"}
                helperText={error ? "This field is required" : ""}
                />
                <BasicSelect
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    options={[
                        { label: "Ten", value: "10" },
                        { label: "Twenty", value: "20" },
                        { label: "Thirty", value: "30" },
                    ]}
                    state="disabled"
                    helperText={error ? "This field is required" : ""}
                />
                <BasicSelect
                    label="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    options={[
                        { label: "Ten", value: "10" },
                        { label: "Twenty", value: "20" },
                        { label: "Thirty", value: "30" },
                    ]}
                    state="error"
                    helperText={error ? "This field is required" : ""}
                />
            </div>
            {/* Example footer*/}
            <Footer />
        </div>
    );
}