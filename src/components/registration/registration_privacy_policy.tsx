"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { privacyPolicyText } from "@components/registration/text";
import React from "react";

export default function RegistrationPrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Top Part */}
      <p className="text-[2.5rem] font-medium text-primary-900">
        Privacy Policy
      </p>

      {/* Middle Part */}
      <div className="flex flex-col gap-2">
        <div className="w-[25.75rem] h-[21.375rem] px-6 pb-2 overflow-auto">
          <p className="text-[1rem] text-primary-900">
            {privacyPolicyText.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* Bottom Part */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          className="w-[7rem] h-[2.1875rem] bg-white rounded-md items-center justify-center text-primary-400 border-1 border-primary-400 text-[16px] cursor-pointer hover:opacity-90"
          onClick={() => router.push("/registration/password")}
        >
          Back
        </button>
      </div>
    </div>
  );
}
