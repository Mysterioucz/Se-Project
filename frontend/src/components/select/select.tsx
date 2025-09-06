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
  // Local error state: initialized from prop and resynced when prop changes.
  // We clear this local error when user selects something.
  const [internalError, setInternalError] = React.useState<boolean>(
    state === "error"
  );

  React.useEffect(() => {
    setInternalError(state === "error");
  }, [state]);

  const isDisabled = state === "disabled";

  const handleChange = (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => {
    // clear local error when user selects a new value
    if (internalError) {
      setInternalError(false);
    }
    onChange(event, child);
  };

  return (
    <div className="flex w-[250px] h-[56px] p-4 items-center gap-3">
      <FormControl
        fullWidth
        error={internalError}
        disabled={isDisabled}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "var(--Radius-sm, 4px)",
            background: "var(--Common-white, #FFF)",
            "& fieldset": {
              border: "var(--Elevation-sm, 1px) solid var(--Gray-200, #A9ADB1)",
            },
            // use MUI's focused class so we override the default blue
            "&.Mui-focused fieldset": {
              border:
                "var(--Elevation-sm-md, 2px) solid var(--Primary-600, #067399)",
            },
            // MUI applies .Mui-error when FormControl's error prop is true
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
        <InputLabel
          sx={{
            color: internalError ? "#5F696C" : undefined,
            "&.Mui-focused": {
              color: internalError ? "#5F696C" : "#022B39", // blue-green when focused, unless error
            },
          }}
        >
          {label}
        </InputLabel>

        <Select
          value={value}
          onChange={handleChange}
          label={label}
          sx={{
            "& .MuiSelect-icon": {
              color: isDisabled ? "#A9ADB1" : undefined,
              opacity: isDisabled ? 0.6 : 1,
              display: "block",
            },
          }}
        >
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
