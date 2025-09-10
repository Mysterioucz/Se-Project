"use client";

import React from "react";
import Modal from "./Modal";
import { useSessionManagement } from "@src/lib/SessionManagement";

interface SessionModalProps {
    open: boolean;
    timeLeft: number;
    isExpired: boolean;
    onExtendSession: () => void;
    onSignOut: () => void;
    icon?: string;
}

export default function SessionModal({
    open,
    timeLeft,
    isExpired,
    onExtendSession,
    onSignOut,
    icon,
}: SessionModalProps) {
    const description = isExpired
        ? "Your session has expired due to inactivity. Please sign in again to continue."
        : "You have been inactive for a while. Your session will expire soon for security reasons.";

    return (
        <>
            <Modal
                open={open}
                onClose={() => {}}
                topic={
                    isExpired ? "Session Expired" : "Session Timeout Warning"
                }
                icon={icon}
                subTopic="Security Notice"
                description={description}
                leftButtonText="Sign Out"
                rightButtonText="Continue Session"
                onLeftButton={onSignOut}
                onRightButton={onExtendSession}
                variant="warning"
                preventClose={true}
                disableRightButton={isExpired}
            />

            {/* Custom countdown display overlay */}
            {open && !isExpired && (
                <style jsx global>{`
                    .MuiDialogContent-root::after {
                        content: "";
                        display: block;
                        margin-top: 16px;
                        padding: 16px;
                        background-color: var(--color-warning-50, #fff3e0);
                        border-radius: 8px;
                        text-align: center;
                        font-weight: 600;
                        color: var(--color-warning-dark, #e65100);
                    }
                `}</style>
            )}
        </>
    );
}

export function useSessionModal() {
    const sessionManagement = useSessionManagement({
        inactivityTimeout: 30, // 30 นาที
        warningDuration: 60, // 60 วินาที
    });

    const SessionModalComponent = () => (
        <SessionModal
            open={sessionManagement.isWarningModalOpen}
            timeLeft={sessionManagement.timeLeft}
            isExpired={sessionManagement.isSessionExpired}
            onExtendSession={sessionManagement.extendSession}
            onSignOut={sessionManagement.handleSignOut}
            icon="/icons/warning.svg" // ปรับ path ตามโครงสร้างไฟล์
        />
    );

    return {
        ...sessionManagement,
        SessionModalComponent,
    };
}
