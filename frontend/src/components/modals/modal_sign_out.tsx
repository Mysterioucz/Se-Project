"use client";

import Modal from "@components/Modal";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

interface ModalSignOutProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ModalSignOut({ isOpen, onClose }: ModalSignOutProps) {
    return (
        <Modal
            open={isOpen}
            onClose={() => {}}
            topic="Confirm Sign Out?"
            description="Are you sure you want to sign out? You will need to sign in again to access your account."
            leftButtonText="Cancel"
            rightButtonText="Sign Out"
            onLeftButton={() => onClose()}
            onRightButton={() => signOut({ callbackUrl: "/login" })}
            variant="normal"
            preventClose={false}
            disableRightButton={false}
        />
    );
}
