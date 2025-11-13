"use client";

import {
  registrationData,
  saveRegistrationData,
} from "@components/registration/registration_data"; // Import shared registration data
import { useForm } from "react-hook-form"; // Main form hook
import { z } from "zod"; // Schema validation library
import { zodResolver } from "@hookform/resolvers/zod"; // Connect Zod to React Hook Form
import { useState } from "react";
import { useRouter } from "next/navigation";
import SvgOpenEye from "@components/icons/openEye.svg";
import SvgCloseEye from "@components/icons/closeEye.svg";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must include at least 1 capital letter")
      .regex(
        /[0-9!@#$%^&*(),.?":{}|<>]/,
        "Password must include numbers or symbols"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords not match",
    path: ["confirmPassword"], // Set the error on the confirmPassword field
  });

type FormData = z.infer<typeof schema>;

export default function RegistrationPassword() {
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    criteriaMode: "all", // collect all errors per field
  });

  const onSubmit = (data: FormData) => {
    saveRegistrationData({ password: data.password });
    router.push("/registration/terms");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center gap-8 w-[32.5rem]"
    >
      {/* Top Part */}
      <p className="!text-[2.5rem] !font-medium !text-primary-900">
        Enter Your Information
      </p>

      {/* Password Part */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-3">
            <p
              className={`!text-[1.125rem] !font-semibold ${
                errors.password ? "!text-error-main" : "!text-primary-900"
              }`}
            >
              Password*
            </p>
            <div
              className={`flex gap-2.5 p-4 h-[3.1875rem] border-1 justify-between ${
                errors.password
                  ? "border-error-main"
                  : passwordFocused
                  ? "border-primary-400"
                  : "border-gray-400"
              } rounded-sm items-center`}
            >
              <input
                type={showPassword ? "text" : "password"}
                data-testid="registration-password-input"
                {...register("password")}
                placeholder="Enter your password"
                className="text-[1rem] text-primary-900 font-normal bg-transparent outline-none w-full"
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <div
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <SvgCloseEye /> : <SvgOpenEye />}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <p
            className={`text-[1rem] ${
              Object.values(errors.password?.types || {}).at(0) ===
              "Password must be at least 8 characters long"
                ? "text-error-main"
                : "text-gray-300"
            }`}
          >
            Must be at least 8 characters long
          </p>
          <p
            className={`text-[1rem] ${
              Object.values(errors.password?.types || {})
                .at(1)
                ?.toString()
                .includes("capital")
                ? "text-error-main"
                : Object.values(errors.password?.types || {})
                    .at(0)
                    ?.toString()
                    .includes("capital")
                ? "text-error-main"
                : "text-gray-300"
            }`}
          >
            Must include at least 1 capital letter
          </p>
          <p
            className={`text-[1rem] ${
              Object.values(errors.password?.types || {})
                .at(1)
                ?.toString()
                .includes("numbers")
                ? "text-error-main"
                : Object.values(errors.password?.types || {})
                    .at(0)
                    ?.toString()
                    .includes("numbers")
                ? "text-error-main"
                : "text-gray-300"
            }`}
          >
            Must include numbers or symbols
          </p>
        </div>
      </div>

      {/* Last Name Part */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-3">
            <p
              className={`!text-[1.125rem] !font-semibold ${
                errors.confirmPassword ? "!text-error-main" : "!text-primary-900"
              }`}
            >
              Confirm Password*
            </p>
            <div className="flex flex-col gap-1">
              <div
                className={`flex gap-2.5 p-4 h-[3.1875rem] border-1 justify-between ${
                  errors.confirmPassword
                    ? "border-error-main"
                    : confirmPasswordFocused
                    ? "border-primary-400"
                    : "border-gray-400"
                } rounded-sm items-center`}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  data-testid="registration-confirm-password-input"
                  {...register("confirmPassword")}
                  placeholder="Enter your password"
                  className="text-[1rem] text-primary-900 font-normal bg-transparent outline-none w-full"
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                />
                <div
                  className="cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <SvgCloseEye /> : <SvgOpenEye />}
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-[1rem] text-error-main">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-1">
          <p className="text-[1rem] text-gray-300">Privacy Policy</p>
          <p
            className="text-primary-400 cursor-pointer"
            data-testid="registration-password-privacy-link"
            onClick={() => router.push("/registration/privacyPolicy")}
          >
            Link
          </p>
        </div>
      </div>

      {/* Bottom Part */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          data-testid="registration-password-back-btn"
          className="w-[7rem] h-[2.1875rem] bg-white rounded-md items-center justify-center text-primary-400 border-1 border-primary-400 text-[16px] cursor-pointer hover:opacity-90"
          onClick={() => router.push("/registration/name")}
        >
          Back
        </button>
        <button
          type="submit"
          data-testid="registration-password-next-btn"
          className="w-[7rem] h-[2.1875rem] bg-primary-400 rounded-md items-center justify-center text-white text-[16px] cursor-pointer hover:opacity-90"
        >
          Next
        </button>
      </div>
    </form>
  );
}
