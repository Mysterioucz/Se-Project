"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Modal from "./Modal";

export default function SessionGuard() {
    const { data: session, status } = useSession();
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        // Check if session has an error indicating user was deleted
        if (session?.error === "UserDeleted") {
            setShowErrorModal(true);
        }
    }, [session]);

    const handleSignOut = async () => {
        setShowErrorModal(false);
        await signOut({
            callbackUrl: "/login",
            redirect: true,
        });
    };

    if (status === "loading") {
        return null;
    }

    return (
        <Modal
            open={showErrorModal}
            onClose={() => {}}
            icon="/modal/fi-br-critical-warning.svg"
            topic="Account No Longer Exists"
            subTopic="Session Terminated"
            description="This account has been deleted. You will be signed out and redirected to the login page."
            showLeftBtn={false}
            leftButtonText=""
            rightButtonText="Sign Out"
            onRightButton={handleSignOut}
            variant="criticalwarning"
            preventClose={true}
            disableRightButton={false}
        />
    );
}
