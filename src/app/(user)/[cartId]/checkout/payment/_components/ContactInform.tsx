"use client";

import { useCheckout } from "@/src/contexts/CheckoutContext";
import TextFieldComponent from "@components/text_field";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
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

const ContactInform = React.memo(function ContactInform({
    onStatusChange,
}: ContactInformProps) {
    const { checkoutData } = useCheckout();
    const {
        watch,
        formState: { errors, isValid },
        setValue,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        mode: "onChange",
        defaultValues: {
            userContactEmail: checkoutData.payment.email || "",
            userTel: checkoutData.payment.telNo || "",
        },
    });
    const values = watch();
    const lastNotifiedRef = useRef<string>("");

    useEffect(() => {
        const currentValues = JSON.stringify({
            isValid,
            email: values.userContactEmail,
            tel: values.userTel,
        });

        // Skip if values haven't changed or if both fields are empty (initial state)
        if (
            currentValues === lastNotifiedRef.current ||
            (!values.userContactEmail && !values.userTel)
        ) {
            return;
        }
        lastNotifiedRef.current = currentValues;
        onStatusChange(isValid, values);
    }, [isValid, values.userContactEmail, values.userTel]);

    const handleEmailChange = (val: unknown) => {
        const { text } = val as { text: string };
        setValue("userContactEmail", text, {
            shouldValidate: true,
        });
    };

    const handleTelChange = (val: unknown) => {
        const { text } = val as { text: string };
        setValue("userTel", text, { shouldValidate: true });
    };

    return (
        <form className="flex w-full flex-col gap-[1.5rem]">
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
                            className="h-5 w-5"
                        />
                    }
                    onSubmit={handleEmailChange}
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
                            className="h-5 w-5"
                        />
                    }
                    onSubmit={handleTelChange}
                />
                {errors.userTel && (
                    <p className="text-error-main text-sm">
                        {errors.userTel.message}
                    </p>
                )}
            </div>
        </form>
    );
});

export default ContactInform;
