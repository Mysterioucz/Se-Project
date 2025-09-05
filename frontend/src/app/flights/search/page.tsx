"use client";

import Navbar from "@components/Navbar"
import { useState } from "react";

export default function Page(){
    const [account, setaccount] = useState({isSignIn: true, displayName: "Chanatda K."}); // Waiting to sync with Backend data
    return (
        <div>
            {/* Testing Navigation Bar */}
            <Navbar isSignIn={account.isSignIn} displayName={account.displayName}/>
            Flight Search
        </div>
    );
}