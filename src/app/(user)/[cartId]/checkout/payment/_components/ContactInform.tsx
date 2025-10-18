"use client";

import TextFieldComponent from "@components/text_field";
import { useState } from "react";

interface ContactInformProps {
    onStatusChange: (isValid: boolean) => void;
}

export default function ContactInform({ onStatusChange }: ContactInformProps) {
    // TODO: Update to fetch from user session
    const [userContactEmail, setuserContactEmail] = useState("");
    const [userTel, setuserTel] = useState("");

    const computeIsReady = (email: string, tel: string) => {
        const isEmailFilled = email.trim() !== "";
        const isTelFilled = tel.trim() !== "";
        return isEmailFilled && isTelFilled;
    };

    // Notify parent synchronously when fields change via the onSubmit handlers below.

    return (
        <div className="flex flex-col gap-[1.5rem] w-full">
            <TextFieldComponent
                label="Email Address*"
                textValue={userContactEmail}
                placeHolder="Enter your email"
                disabled={true}
                icon={
                    <img
                        src="/payment/update-info/fi-sr-pencil.svg"
                        alt="toggle"
                        className="w-5 h-5"
                    />
                }
                onSubmit={(val) => {
                    const { text } = val as {
                        text: string;
                    };
                    // TODO: Handle Contact Email Update
                    setuserContactEmail(text);
                    onStatusChange(computeIsReady(text, userTel));
                }}
            />
            <TextFieldComponent
                label="Tel Number*"
                textValue={userTel}
                placeHolder="Enter your tel number"
                disabled={true}
                icon={
                    <img
                        src="/payment/update-info/fi-sr-pencil.svg"
                        alt="toggle"
                        className="w-5 h-5"
                    />
                }
                onSubmit={(val) => {
                    const { text } = val as {
                        text: string;
                    };
                    // TODO: Handle Tel Number Update
                    setuserTel(text);
                    onStatusChange(computeIsReady(userContactEmail, text));
                }}
            />
        </div>
    );
}
