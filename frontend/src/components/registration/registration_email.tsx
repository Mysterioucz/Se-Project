"use client";

import { useForm } from "react-hook-form"; // Main form hook
import { z } from "zod"; // Schema validation library
import { zodResolver } from "@hookform/resolvers/zod"; // Connect Zod to React Hook Form
import { useState } from "react";

const schema = z.object({
  email: z
    .string()
    .nonempty("Email is required") // Cannot be empty
    .email("Invalid email address"), // Must be a valid email
});

type FormData = z.infer<typeof schema>;

export default function RegistrationEmail() {
  let [focused, setFocused] = useState(false);

  const {
    register, // Connects inputs to form
    handleSubmit, // Handles form submission and validation
    formState: { errors }, // Stores validation errors
  } = useForm<FormData>({
    resolver: zodResolver(schema), // Connect Zod schema for validation
  });

  const onSubmit = (data: FormData) => {
    console.log("✅ Valid email:", data.email);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center gap-8 w-[32.5rem]"
    >
      {/* Top Part */}
      <p className="text-[2.5rem] font-medium text-primary-900">
        Create an account
      </p>

      {/* Middle Part */}
      <div className="flex flex-col gap-2">
        {/* Email Part */}
        <div className="flex flex-col gap-3">
          <p
            className={`text-[1.125rem] font-semibold ${
              errors.email ? "text-error-main" : "text-primary-900"
            }`}
          >
            Email Address*
          </p>
          <div className="flex flex-col gap-1">
            <div
              className={`flex gap-2.5 p-4 h-[3.1875rem] border-1 ${
                errors.email
                  ? "border-error-main"
                  : focused
                  ? "border-primary-400"
                  : "border-primary-300"
              } rounded-sm items-center`}
            >
              <input
                type="email"
                {...register("email")}
                placeholder="Enter your email"
                className="text-[1rem] text-primary-900 font-normal bg-transparent outline-none w-full"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </div>
            {errors.email && (
              <p className="text-error-main text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>
        {/* CheckBox Part */}
        <div className="flex items-center gap-2 py-2 px-2.5">
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
          />
          <p className="text-[0.875rem] text-primary-400">
            Yes, I would like Fly with Sigma to send me info about new
            promotion, events, or other related-content.
          </p>
        </div>
      </div>

      {/* Bottom Part */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-[7rem] h-[2.1875rem] bg-primary-400 rounded-md items-center justify-center text-white text-[16px] cursor-pointer hover:opacity-90"
        >
          Next
        </button>
      </div>
    </form>
  );
}
