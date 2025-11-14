"use client";
import Button from "@/src/components/Button";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isSubmitting?: boolean;
}

export default function ConfirmSubmitModal({
    open,
    onClose,
    onConfirm,
    isSubmitting = false,
}: ConfirmModalProps) {
    return (
        <Dialog
            open={open}
            keepMounted
            onClose={isSubmitting ? undefined : onClose}
            aria-describedby="alert-dialog-slide-description"
            PaperProps={{
                style: {
                    borderRadius: "1rem",
                    padding: "2rem 2rem",
                },
            }}
        >
            <DialogTitle
                sx={{
                    padding: "0 0.5rem",
                    fontWeight: "bold",
                    fontSize: "1.75rem",
                    color: "#30A2C5",
                }}
            >
                {isSubmitting ? "Submitting..." : "Confirm submit the request?"}
            </DialogTitle>

            <DialogContent sx={{ padding: "0.5rem 0.5rem", marginTop: "16px" }}>
                <DialogContentText
                    id="alert-dialog-slide-description"
                    sx={{ fontSize: "1rem", color: "#848B8F" }}
                >
                    {isSubmitting
                        ? "Please wait while we submit your request..."
                        : "Are you sure you want to submit the request? This action cannot be undone."}
                </DialogContentText>
            </DialogContent>

            <DialogActions
                sx={{ padding: "1rem 0.5rem 0 0.5rem", marginTop: "16px" }}
            >
                <Button
                    text="Cancel"
                    styleType="stroke"
                    size="md"
                    onClick={onClose}
                    disabled={isSubmitting}
                />
                <Button
                    text={isSubmitting ? "Submitting..." : "Confirm"}
                    styleType="fill"
                    size="md"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                />
            </DialogActions>
        </Dialog>
    );
}
