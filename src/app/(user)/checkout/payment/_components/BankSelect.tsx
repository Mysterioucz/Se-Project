"use client";

import React, { ReactNode } from "react";
import SelectComponent from "@/src/components/select";
import { MenuItem } from "@mui/material";

export type BankOption = {
  value: string;
  label: string;
  image: string;
};

interface BankSelectProps {
  value: string;
  onChange: (e: any) => void;
  options?: BankOption[];
  placeholder?: string;
  renderSelected?: (selected: string, options: BankOption[]) => ReactNode; // ← แก้ type
  disabled?: boolean;
  error?: boolean;
}

const defaultBanks: BankOption[] = [
  { value: "Kasikorn Bank", label: "Kasikorn Bank", image: "/payment/banks/kbank.svg" },
  { value: "Government Savings Bank", label: "Government Savings Bank", image: "/payment/banks/omsin.svg" },
  { value: "Siam Commercial Bank", label: "Siam Commercial Bank", image: "/payment/banks/scb.svg" },
  { value: "Krungthai Bank", label: "Krungthai Bank", image: "/payment/banks/ktb.svg" },
];

export default function BankSelect({
  value,
  onChange,
  options = defaultBanks,
  placeholder = "Select Bank",
  renderSelected,
  disabled = false,
  error = false,
}: BankSelectProps) {
  return (
    <SelectComponent
      labelId="bank-select-label"
      id="bank-select"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      error={error}
      maxChildrenHeight="max-h-[20rem]"
      renderSelected={(selected) => renderSelected ? renderSelected(selected, options) : selected} // ← แก้ให้ตรง type
    >
      {options.map((bank) => (
        <MenuItem key={bank.value} value={bank.value} sx={{ height: 60, py: 1 }}>
          <div className="flex items-center gap-2">
            <img src={bank.image} alt={bank.label} width={36} height={36} />
            <span>{bank.label}</span>
          </div>
        </MenuItem>
      ))}
    </SelectComponent>
  );
}