"use client";

import { useEffect, useState } from "react";
import TextFieldComponent from "@components/text_field";

interface ContactInformProps {
  onStatusChange: (isValid: boolean) => void;
}

export default function ContactInform({ onStatusChange }: ContactInformProps) {
  // TODO: Update to fetch from user session
  const [userContactEmail, setuserContactEmail] = useState("");
  const [userTel, setuserTel] = useState("");

  useEffect(() => {
    const isEmailFilled = userContactEmail.trim() !== "";
    const isTelFilled = userTel.trim() !== "";

    const isReadyToSend = isEmailFilled && isTelFilled;

    onStatusChange(isReadyToSend);
  }, [userContactEmail, userTel, onStatusChange]);

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
        }}
      />
    </div>
  );
}
