"use client";

import * as React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from "@mui/material";

interface Option {
  label: string;
  value: string;
}

type SelectState = "enabled" | "hover" | "focused" | "disabled" | "error";

interface BasicSelectProps {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
  options: Option[];
  state?: SelectState;
  helperText?: string;
}

export default function BasicSelect({
  label,
  value,
  onChange,
  options,
  state = "enabled",
  helperText,
}: BasicSelectProps) {
  const isError = state === "error";
  const isDisabled = state === "disabled";

  return (
    <div className="flex w-[250px] h-[56px] p-4 items-center gap-3">
      <FormControl
        fullWidth
        error={state === "error"}
        disabled={state === "disabled"}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "var(--Radius-sm, 4px)",
            background: "var(--Common-white, #FFF)",
            "& fieldset": {
              border: "var(--Elevation-sm, 1px) solid var(--Gray-200, #A9ADB1)",
            },
            ...(state === "hover" && {
              "& fieldset": {
                borderColor: "var(--Gray-400, #5F696C)",
              },
            }),
            ...(state === "focused" && {
              "& fieldset": {
                borderColor: "var(--Gray-400, #067399)",
                borderWidth: 2,
              },
            }),
            "&.Mui-error fieldset": {
              borderColor: "var(--Error-main, #C53737)",
            },
            "&.Mui-disabled fieldset": {
              borderColor: "var(--Disabled-light, #D6D6D6)",
              background: "var(--Common-white, #FFF)",
            },
          },
        }}
      >
        <InputLabel>{label}</InputLabel>
        <Select value={value} onChange={onChange} label={label}>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </div>
  );
}
