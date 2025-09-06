"use client";
import { ReactNode, useState } from "react";

type ItemState = "enabled" | "focused" | "hover";

interface Props {
    prefix: ReactNode;
    label: string;
    onClick?: () => void;
}

export default function ItemComponent({ prefix, label, onClick }: Props) {
    function resolveTextColor(state: ItemState) {
        switch (state) {
            case "enabled":
                return "text-primary-900";
            case "focused":
                return "text-common-white";
            case "hover":
                return "text-primary-700";
        }
    }

    function resolveIconColor(state: ItemState) {
        switch (state) {
            case "enabled":
                return "text-gray-400";
            case "focused":
                return "text-common-white";
            case "hover":
                return "text-primary-400";
        }
    }

    function resolveBackgroundColor(state: ItemState) {
        switch (state) {
            case "enabled":
                return "bg-common-white";
            case "focused":
                return "bg-primary-500";
            case "hover":
                return "bg-gray-50";
        }
    }

    function handleStateChange(newState: ItemState) {
        setState(newState);
    }

    const [state, setState] = useState<ItemState>("enabled");
    const iconColor = resolveIconColor(state);
    const textColor = resolveTextColor(state);
    const bgColor = resolveBackgroundColor(state);

    return (
        <button
            className={`flex items-center p-4 ${bgColor} gap-[0.625rem] w-[15.625rem] h-fit rounded-sm`}
            onMouseEnter={() => handleStateChange("hover")}
            onMouseLeave={() => handleStateChange("enabled")}
            onFocus={() => handleStateChange("focused")}
            onClick={onClick}
        >
            <div
                className={`max-w-[1.25rem] max-h-[1.25rem] h-[1.25rem] w-[1.25rem] ${iconColor}`}
            >
                {prefix}
            </div>
            <div className="flex h-fit items-center">
                <h3 className={`font-bold ${textColor}`}>{label}</h3>
            </div>
        </button>
    );
}
