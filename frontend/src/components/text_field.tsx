"use client";
import { useEffect, useState } from "react";
import TelPrefix from "./prefix/tel_prefix";
interface Props {
    label: string;
    textValue: string;
    telValue?: string;
    placeHolder?: string;
    telForm?: boolean;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    onChange?: (value: unknown) => void;
    // The onChange event returns an object with the structure { tel: string, text: string }
}

export default function TextFieldComponent({
    label,
    textValue,
    telValue,
    placeHolder,
    telForm,
    disabled,
    error,
    helperText,
    onChange,
}: Props) {
    const [state, setState] = useState<
        "enabled" | "focused" | "hover" | "error" | "disabled"
    >("enabled");

    function resolveBorderColor(state: string) {
        switch (state) {
            case "enabled":
                return "border-gray-200";
            case "focused":
                return "border-primary-600";
            case "hover":
                return "border-gray-400";
            case "error":
                return "border-error-500";
            case "disabled":
                return "border-gray-100";
            default:
                return "border-gray-200";
        }
    }

    function resolveHelperTextColor(state: string) {
        switch (state) {
            case "error":
                return "text-error-light";
            case "disabled":
                return "text-gray-400";
            default:
                return "text-gray-400";
        }
    }

    useEffect(() => {
        if (disabled) {
            setState("disabled");
        } else if (error) {
            setState("error");
        } else {
            setState("enabled");
        }
    }, [disabled, error]);

    return (
        <div className="flex flex-col w-full h-fit gap-3">
            <h3 className="text-lg text-primary-900 font-bold">{label}</h3>
            <div
                className={`flex p-4 gap-2.5 justify-center text-primary-900 text-[1rem] rounded-[0.25rem] border-2 ${resolveBorderColor(
                    state
                )}`}
                onFocus={() => {
                    if (!disabled) {
                        setState("focused");
                    }
                }}
                onMouseEnter={() => {
                    if (!disabled) {
                        setState("hover");
                    }
                }}
                onMouseLeave={() =>
                    setState(
                        disabled ? "disabled" : error ? "error" : "enabled"
                    )
                }
            >
                {telForm && (
                    <TelPrefix
                        value={telValue}
                        onChange={(e) =>
                            onChange &&
                            onChange({ tel: e.target.value, text: textValue })
                        }
                        disabled={disabled}
                    />
                )}
                <input
                    className="w-full h-full bg-transparent text-lg outline-none"
                    type="text"
                    placeholder={placeHolder}
                    disabled={disabled}
                    onChange={(e) =>
                        onChange &&
                        onChange({ tel: telValue, text: e.target.value })
                    }
                />
            </div>
            {helperText && (
                <p className={`${resolveHelperTextColor(state)}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
}
