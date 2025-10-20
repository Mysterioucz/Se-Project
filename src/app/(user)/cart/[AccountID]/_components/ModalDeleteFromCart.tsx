"use client";
import Modal from "@components/Modal";

interface ModalDeleteFromCartProps {
    isOpen: boolean;
    onClose: () => void;
    handleDeleteFromCart: (CartID:number, UserAccountID:string) => void;
    CartID: number;
    UserAccountID: string;
}

export default function ModalDeleteFromCart({ isOpen, onClose, handleDeleteFromCart, CartID, UserAccountID }: ModalDeleteFromCartProps) {
    return (
        <Modal
            open={isOpen}
            onClose={() => {}}
            topic="Confirm remove item from cart?"
            description="Are you sure you want to remove this item from cart? This action cannot be undone."
            leftButtonText="Cancel"
            rightButtonText="Confirm"
            onLeftButton={() => onClose()}
            onRightButton={() => {
                handleDeleteFromCart(CartID, UserAccountID);
                onClose();
            }}
            variant="criticalwarning"
            preventClose={false}
            disableRightButton={false}
        />
    );
}
