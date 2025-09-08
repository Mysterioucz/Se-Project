"use client";

import Modal from "@components/Modal"; // adjust the path as needed

interface ModalDeleteAccountProps {
  isOpen: boolean;
  onClose: () => void;
}

// TODO: connect with backend
export default function ModalDeleteAccount({
  isOpen, onClose
}: ModalDeleteAccountProps) {
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
      onLeftButton={() => {onClose}}
      onRightButton={() => {}}
      variant="criticalwarning"
      preventClose={false}
      disableRightButton={false}
    />
  );
}
