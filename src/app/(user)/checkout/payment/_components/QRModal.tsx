"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Button from "@components/Button";

interface QRModalProps {
  open: boolean;
  onClose: () => void;
}

export default function QRModal({ open, onClose }: QRModalProps) {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    if (!open) return;

    async function fetchAmount() {
      try {
        // TODO: Fetch actual amount from backend
        // const res = await fetch("/api/payment/amount");
        // const data = await res.json();
        // setAmount(data.amount);
        setAmount(1234.56); // Mock amount for demonstration
      } catch (err) {
        console.error("Failed to fetch amount", err);
      }
    }

    fetchAmount();
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { borderRadius: "1rem", padding: "1rem" } } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          fontWeight: "bold",
          fontSize: "2rem",
          color: "var(--color-primary-900)",
        }}
      >
        <img
          src="/payment/ScanIcon.svg"
          alt="Payment Icon"
          className="w-[1.75rem] h-[1.75rem]"
        />
        Scan to Pay
      </DialogTitle>

      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <img
          src="/payment/QR.svg"
          alt="QR Code"
          className="w-[17.9375rem] h-[17.9375rem] object-contain"
        />

        <div className="flex flex-col gap-[0.5rem]">
          <div className="text-[1.5rem] font-semibold font-sans text-primary-700 text-center">
            Total Amount: ฿{amount}
          </div>

          <div className="text-[1.125rem] font-semibold font-sans text-gray-300 text-center">
            Scan this QR code with your banking app to complete <br /> the payment
          </div>
        </div>
      </DialogContent>

      <DialogActions
        sx={{ display: "flex-row", justifyContent: "center", pb: 2 }}
      >
        <Button
          text="Cancel"
          align="center"
          styleType="stroke"
          size="md"
          width="w-full"
          height="h-full"
          onClick={onClose}
        />
        <Button
          text="Payment Complete"
          align="center"
          styleType="fill"
          size="md"
          width="w-full"
          height="h-full"
          onClick={() => router.push("/checkout/payment/success")}
        />
      </DialogActions>
    </Dialog>
  );
}
