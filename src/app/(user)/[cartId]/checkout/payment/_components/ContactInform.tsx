"use client";

import { useCheckout } from "@/src/contexts/CheckoutContext";
import TextFieldComponent from "@components/text_field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ContactInformProps {
    onStatusChange: (isValid: boolean, values: ContactFormData) => void;
}

const contactSchema = z.object({
    userContactEmail: z
        .string()
        .nonempty("Email is required")
        .email("Please enter a valid email (e.g. example@gmail.com)"),
    userTel: z
        .string()
        .nonempty("Telephone number is required")
        .regex(/^[0-9]+$/, "Phone number must contain only digits")
        .min(10, "Phone number should be at least 10 digits")
        .max(10, "Phone number should be at most 10 digits"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactInform({ onStatusChange }: ContactInformProps) {
    const { checkoutData } = useCheckout();
    const {
        watch,
        formState: { errors, isValid },
        setValue,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: "onChange", // validate on every change
        defaultValues: {
            userContactEmail: checkoutData.payment.email || "",
            userTel: checkoutData.payment.telNo || "",
        },
    });
    const values = watch();

    // Notify parent whenever validation state changes
    useEffect(() => {
        const val = watch();
        onStatusChange(isValid, val);
    }, [isValid]);

    return (
        <form className="flex flex-col gap-[1.5rem] w-full">
            {/* EMAIL FIELD */}
            <div className="flex flex-col gap-1">
                <TextFieldComponent
                    label="Email Address*"
                    textValue={values.userContactEmail}
                    placeHolder="Enter your email"
                    disabled={false}
                    icon={
                        <img
                            src="/payment/update-info/fi-sr-pencil.svg"
                            alt="toggle"
                            className="w-5 h-5"
                        />
                    }
                    onSubmit={(val) => {
                        const { text } = val as { text: string };
                        setValue("userContactEmail", text, {
                            shouldValidate: true,
                        });
                    }}
                />
                {errors.userContactEmail && (
                    <p className="text-error-main text-sm">
                        {errors.userContactEmail.message}
                    </p>
                )}
            </div>

            {/* TEL FIELD */}
            <div className="flex flex-col gap-1">
                <TextFieldComponent
                    label="Tel Number*"
                    textValue={values.userTel}
                    placeHolder="Enter your tel number"
                    disabled={false}
                    icon={
                        <img
                            src="/payment/update-info/fi-sr-pencil.svg"
                            alt="toggle"
                            className="w-5 h-5"
                        />
                    }
                    onSubmit={(val) => {
                        const { text } = val as { text: string };
                        setValue("userTel", text, { shouldValidate: true });
                    }}
                />
                {errors.userTel && (
                    <p className="text-error-main text-sm">
                        {errors.userTel.message}
                    </p>
                )}
            </div>
        </form>
    );
}
