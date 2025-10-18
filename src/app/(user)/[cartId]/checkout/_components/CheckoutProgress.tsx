"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const steps = [
    { id: "info", title: "Information" },
    { id: "seat", title: "Seat Selection" },
    { id: "payment", title: "Payment" },
];

export default function CheckoutProgress() {
    const pathname = usePathname();
    const cartId = useParams().cartId;
    const [currentStep, setCurrentStep] = useState("info");

    useEffect(() => {
        const pathSegments = pathname.split("/").filter(Boolean);
        const lastSegment = pathSegments[pathSegments.length - 1];

        if (steps.some((step) => step.id === lastSegment)) {
            setCurrentStep(lastSegment);
        }
    }, [pathname]);

    const router = useRouter();
    const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

    function clickNode(stepId: string) {
        router.push(`${cartId}/checkout/${stepId}`);
    }

    function nodeContainer(step: (typeof steps)[number], index: number) {
        return (
            <div
                key={step.id}
                className="flex flex-col items-center relative z-10 cursor-pointer"
                onClick={() => clickNode(step.id)}
            >
                {/* Circle */}
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index <= currentStepIndex
                            ? "bg-primary-400 text-white"
                            : "bg-gray-200 text-gray-200"
                    }`}
                ></div>
                {/* Step Title */}
                <span
                    className={`mt-2 text-sm font-medium transition-colors duration-300 ${
                        index <= currentStepIndex
                            ? "text-primary-400"
                            : "text-gray-200"
                    }`}
                >
                    {step.title}
                </span>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[67.5rem]">
            <div className="relative">
                {/* Progress Bar */}
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => nodeContainer(step, index))}
                </div>

                {/* Background Line */}
                <div className="absolute top-3.5 left-5 right-4 h-1 bg-gray-200 -z-10"></div>

                {/* Progress Line */}
                <div
                    className="absolute top-3.5 left-5 h-1 bg-primary-400 -z-10 transition-all duration-500 ease-in-out"
                    style={{
                        width: `calc(${
                            (currentStepIndex / (steps.length - 1)) * 95
                        }%`,
                    }}
                ></div>
            </div>
        </div>
    );
}
