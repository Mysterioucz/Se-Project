"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { termsText } from "@/components/registration/terms_and_conditions";
import React from "react";

export default function RegistrationTerms() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Top Part */}
      <p className="text-[2.5rem] font-medium text-primary-900">
        Terms and Conditions
      </p>

      {/* Middle Part */}
      <div className="flex flex-col gap-2">
        <div className="w-[25.75rem] h-[21.375rem] px-6 pb-2 overflow-auto">
          <p className="text-[1rem] text-primary-900">
            {termsText.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 py-2 px-2.5">
          <input
            type="checkbox"
            id="terms"
            className="
                flex
                w-5 h-5 
                items-center justify-center
                appearance-none 
                border-2 border-primary-400 
                rounded-md 
                checked:bg-primary-400 checked:border-primary-400
                relative
                checked:before:content-['✓'] 
                checked:before:text-white checked:before:text-sm
                cursor-pointer
            "
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <p className="text-[0.875rem] text-primary-400">
            I accept terms and conditions.
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
        <button
          type="submit"
          disabled={!accepted}
          className={`w-[7rem] h-[2.1875rem] ${
            accepted ? "bg-primary-400" : "bg-disable-light"
          } rounded-md items-center justify-center ${
            accepted ? "text-white" : "text-disable-dark"
          } text-[16px] cursor-pointer hover:opacity-90`}
          onClick={() => router.push("/registration/success")}
        >
          Next
        </button>
      </div>
    </div>
  );
}
