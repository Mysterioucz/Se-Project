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
    width?: string; // custom width
    height?: string; // custom height
    labelFont?: string; // custom font
    labelSize?: string; // custom text size
    labelColor?: string; // custom text color
    gap?: string; // custom gap between label and textfield
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
    width = "w-full",
    height = "h-fit",
    labelFont="!font-bold",
    labelSize="!text-lg",
    labelColor="!text-color-primary-900",
    gap = "gap-3",
    required,
    onChange,
    onInput,
    onSubmit,
}: Props) {
    // Internal disabled state (toggled by icon)
    const [isDisabledInternal, setIsDisabledInternal] = useState<boolean>(
        disabled ?? false
    );

    const [state, setState] = useState<State>(
        disabled ? "disabled" : error ? "error" : "enabled"
    );

    const computedDisabled = isDisabledInternal;

    // Internal text state (for typing while enabled)
    const [currentText, setCurrentText] = useState<string>(textValue);

    // Sync text when props change or field toggles
    useEffect(() => {
        if (!computedDisabled) {
            setCurrentText(textValue);
        }
    }, [textValue, computedDisabled]);

    function handleStateChange(newState: State) {
        if (computedDisabled) setState("disabled");
        else if (error) setState("error");
        else setState(newState);
    }

    function resolveBorderColor(s: State) {
        switch (s) {
            case "enabled":
                return "border-gray-200";
            case "focused":
                return "border-primary-600";
            case "hover":
                return "border-gray-400";
            case "error":
                return "border-error-main";
            case "disabled":
                return "border-gray-100";
            default:
                return "border-gray-200";
        }
    }

    function resolveHelperTextColor(s: State) {
        switch (s) {
            case "error":
                return "text-error-light";
            case "disabled":
                return "text-disable-dark";
            default:
                return "text-gray-400";
        }
    }

    useEffect(() => {
        if (computedDisabled) setState("disabled");
        else if (error) setState("error");
        else setState("enabled");
    }, [computedDisabled, error]);

    // Original icon toggle (enable/disable)
    function handleIconClick() {
        setIsDisabledInternal((prev) => !prev);
    }

    // Submit function
    function submitValueIfEnabled() {
        if (!icon || computedDisabled) return;
        onSubmit?.({ tel: telValue, text: currentText });
        setIsDisabledInternal(true); // disable after submit
    }

    // Handle ENTER key
    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") submitValueIfEnabled();
    }

    return (
        <div className={`flex flex-col ${width} ${height} ${gap}`}>
            {label && (
                <h3 className={`${labelFont} ${labelSize} ${labelColor}`}>
                    {label}
                </h3>
            )}

            <div
                className={`flex items-center p-4 gap-2.5 justify-between text-[1rem] rounded-[0.25rem] bg-white border-2 ${resolveBorderColor(
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
                            onChange &&
                            onChange({ tel: e.target.value, text: currentText })
                        }
                        disabled={computedDisabled}
                    />
                )}

                <div className="flex items-center w-full">
                    <input
                        type="text"
                        className={`w-full h-full bg-transparent text-lg text-color-gray-400 disabled:text-color-disable-dark outline-none placeholder:text-color-gray-400 disabled:placeholder:text-color-disable-dark ${
                            icon ? "pr-4" : ""
                        }`}
                        placeholder={placeHolder}
                        disabled={computedDisabled}
                        value={currentText}
                        onChange={(e) => {
                            setCurrentText(e.target.value);
                            onChange &&
                                onChange({
                                    tel: telValue,
                                    text: e.target.value,
                                });
                        }}
                        onInput={onInput}
                        onKeyDown={handleKeyDown}
                    />

                    {icon && (
                        <button
                            type="button"
                            onClick={() => {
                                if (!computedDisabled) submitValueIfEnabled();
                                else handleIconClick();
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
                <p className={`${resolveHelperTextColor(state)}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
}
