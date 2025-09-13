"use client";
import { useEffect, useState } from "react";
import TelPrefix from "./prefix/tel_prefix";

interface Props {
  label?: string;
  textValue: string;
  telValue?: string;
  placeHolder?: string;
  telForm?: boolean;
  required?: boolean;
  disabled?: boolean; // initial state only
  error?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  onChange?: (value: unknown) => void;
  onInput?: (value: unknown) => void;
  onSubmit?: (value: unknown) => void; // callback to submit value
}

type State = "enabled" | "focused" | "hover" | "error" | "disabled";

export default function TextFieldComponent({
  label,
  textValue,
  telValue = "+66",
  placeHolder,
  telForm,
  disabled,
  error,
  helperText,
  icon,
  onChange,
  onInput,
  onSubmit,
}: Props) {
  // Internal disabled state always toggled by icon
  const [isDisabledInternal, setIsDisabledInternal] = useState<boolean>(
    disabled ?? false
  );

  const [state, setState] = useState<State>(
    disabled ? "disabled" : error ? "error" : "enabled"
  );

  const computedDisabled = isDisabledInternal;

  // Internal state for typing when enabled
  const [currentText, setCurrentText] = useState<string>(textValue);

  // Sync with parent prop if it changes
  useEffect(() => {
    setCurrentText(textValue);
  }, [textValue]);

  function handleStateChange(newState: State) {
    if (computedDisabled) {
      setState("disabled");
    } else if (error) {
      setState("error");
    } else {
      setState(newState);
    }
  }

  function resolveBorderColor(s: State) {
    switch (s) {
      case "enabled":
        return "border-[var(--color-gray-200)]";
      case "focused":
        return "border-[var(--color-primary-600)]";
      case "hover":
        return "border-[var(--color-gray-400)]";
      case "error":
        return "border-[var(--color-error-main)]";
      case "disabled":
        return "border-[var(--color-gray-100)]";
      default:
        return "border-[var(--color-gray-200)]";
    }
  }

  function resolveHelperTextColor(s: State) {
    switch (s) {
      case "error":
        return "text-[var(--color-error-light)]";
      case "disabled":
        return "text-[var(--color-disable-dark)]";
      default:
        return "text-[var(--color-gray-400)]";
    }
  }

  // Update visual state whenever disabled or error changes
  useEffect(() => {
    if (computedDisabled) {
      setState("disabled");
    } else if (error) {
      setState("error");
    } else {
      setState("enabled");
    }
  }, [computedDisabled, error]);

  // Toggle enable/disable when clicking icon (original behavior)
  function handleIconClick() {
    setIsDisabledInternal((prev) => !prev);
  }

  // Submit function only if already enabled
  function submitValueIfEnabled() {
    if (!icon || computedDisabled) return; // Only submit if icon exists and field is enabled
    onSubmit?.({ tel: telValue, text: currentText });
    setIsDisabledInternal(true); // disable after submit
  }

  // Handle ENTER key press
  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submitValueIfEnabled();
    }
  }

  return (
    <div className="flex flex-col w-full h-fit gap-3">
      {label && (
        <h3 className="!text-lg !font-bold !text-[var(--color-primary-900)]">
          {label}
        </h3>
      )}

      <div
        className={`flex items-center p-4 gap-2.5 justify-between text-[1rem] rounded-[0.25rem] border-2 ${resolveBorderColor(
          state
        )}`}
        onFocus={() => handleStateChange("focused")}
        onMouseEnter={() => handleStateChange("hover")}
        onMouseLeave={() => handleStateChange("enabled")}
      >
        {telForm && (
          <TelPrefix
            value={telValue}
            onChange={(e) =>
              onChange && onChange({ tel: e.target.value, text: currentText })
            }
            disabled={computedDisabled}
          />
        )}

        {/* Input + Icon container */}
        <div className="flex items-center w-full">
          <input
            className={`w-full h-full bg-transparent text-lg text-[var(--color-gray-400)] disabled:text-[var(--color-disable-dark)] outline-none placeholder-[var(--color-gray-400)] disabled:placeholder-[var(--color-disable-dark)] ${
              icon ? "pr-4" : ""
            }`}
            type="text"
            placeholder={placeHolder}
            disabled={computedDisabled}
            value={currentText}
            onChange={(e) => {
              setCurrentText(e.target.value); // update internal state immediately
              onChange && onChange({ tel: telValue, text: e.target.value });
            }}
            onInput={onInput}
            onKeyDown={handleKeyPress}
          />

          {icon && (
            <button
              type="button"
              onClick={() => {
                if (!computedDisabled) {
                  submitValueIfEnabled(); // submit if already enabled
                } else {
                  handleIconClick(); // original toggle logic
                }
              }}
              aria-pressed={computedDisabled}
              className="ml-2 pr-2 flex items-center cursor-pointer"
            >
              {icon}
            </button>
          )}
        </div>
      </div>

      {helperText && (
        <p className={`${resolveHelperTextColor(state)}`}>{helperText}</p>
      )}
    </div>
  );
}
