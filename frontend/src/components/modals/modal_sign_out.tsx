'use client';

import Modal from "@components/Modal"; // adjust the path as needed

interface ModalSignOutProps {
  isOpen: boolean;
}

export default function ModalSignOut({ isOpen }: ModalSignOutProps) {
  return (
    <Modal
      open={isOpen}
      onClose={() => {}}
      topic="Confirm Sign Out?"
      description="Are you sure you want to sign out? You will need to sign in again to access your account."
      leftButtonText="Cancel"
      rightButtonText="Log Out"
      onLeftButton={() => {}}
      onRightButton={() => {}}
      variant="normal"
      preventClose={false}
      disableRightButton={false}
    />
  );
}