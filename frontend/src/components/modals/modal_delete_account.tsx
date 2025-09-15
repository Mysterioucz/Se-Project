"use client";

import Modal from "@components/Modal"; // adjust the path as needed
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

interface ModalDeleteAccountProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalDeleteAccount({
  isOpen,
  onClose,
}: ModalDeleteAccountProps) {
  const session = useSession();
  const accountId = session?.data?.user?.id;
  async function handleDeleteAccount() {
    try {
      const result = await fetch(`/api/v1/account/${accountId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const resultData = await result.json();
      if (resultData.success) {
        signOut({ callbackUrl: "/login" });
      } else {
        console.error("Failed to delete account:", resultData.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }

  return (
    <Modal
      open={isOpen}
      onClose={() => {}}
      icon="/modal/fi-br-critical-warning.svg"
      topic="Delete Account - CRITICAL WARNING"
      subTopic="This action cannot be undone"
      description="All your data, including bookings, preferences, and account information
                  will be permanently deleted. You will lose access to all services and
                  cannot recover your account."
      leftButtonText="Cancel"
      rightButtonText="Yes, Delete Forever"
      onLeftButton={() => onClose()}
      onRightButton={() => {
        handleDeleteAccount();
        onClose();
      }}
      variant="criticalwarning"
      preventClose={false}
      disableRightButton={false}
    />
  );
}
