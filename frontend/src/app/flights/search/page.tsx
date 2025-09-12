"use client";

import { signOut, useSession } from "next-auth/react";

export default function Page() {

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
