"use client";

import { registrationData, saveRegistrationData } from "@components/registration/registration_data"; // Import shared registration data
import { useForm } from "react-hook-form"; // Main form hook
import { z } from "zod"; // Schema validation library
import { zodResolver } from "@hookform/resolvers/zod"; // Connect Zod to React Hook Form
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(100, "First name must be at most 100 characters")
        .nonempty("First name is required"),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(100, "Last name must be at most 100 characters")
        .nonempty("Last name is required"),
});

type FormData = z.infer<typeof schema>;

export default function RegistrationName() {
    const [nameFocused, setNameFocused] = useState(false);
    const [lastNameFocused, setLastNameFocused] = useState(false);
    const router = useRouter();

  const {
    register, // Connects inputs to form
    handleSubmit, // Handles form submission and validation
    formState: { errors }, // Stores validation errors
  } = useForm<FormData>({
    resolver: zodResolver(schema), // Connect Zod schema for validation
    defaultValues: {
      firstName: registrationData.firstName || "",
      lastName: registrationData.lastName || "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("✅ Valid name:", data.firstName, data.lastName);
    saveRegistrationData({ firstName: data.firstName, lastName: data.lastName });
    console.log("Current registration data:", registrationData);
    router.push("/registration/password");
  };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center gap-8 w-[32.5rem]"
        >
            {/* Top Part */}
            <p className="text-[2.5rem] font-medium text-primary-900">
                Enter Your Information
            </p>

            {/* First Name Part */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-3">
                    <p
                        className={`text-[1.125rem] font-semibold ${
                            errors.firstName
                                ? "text-error-main"
                                : "text-primary-900"
                        }`}
                    >
                        First Name*
                    </p>
                    <div className="flex flex-col gap-1">
                        <div
                            className={`flex gap-2.5 p-4 h-[3.1875rem] border-1 ${
                                errors.firstName
                                    ? "border-error-main"
                                    : nameFocused
                                    ? "border-primary-400"
                                    : "border-gray-400"
                            } rounded-sm items-center`}
                        >
                            <input
                                {...register("firstName")}
                                placeholder="Enter your first name"
                                className="text-[1rem] text-primary-900 font-normal bg-transparent outline-none w-full"
                                onFocus={() => setNameFocused(true)}
                                onBlur={() => setNameFocused(false)}
                            />
                        </div>
                        {errors.firstName && (
                            <p className="text-error-main text-sm">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Last Name Part */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-3">
                        <p
                            className={`text-[1.125rem] font-semibold ${
                                errors.lastName
                                    ? "text-error-main"
                                    : "text-primary-900"
                            }`}
                        >
                            Last Name*
                        </p>
                        <div className="flex flex-col gap-1">
                            <div
                                className={`flex gap-2.5 p-4 h-[3.1875rem] border-1 ${
                                    errors.lastName
                                        ? "border-error-main"
                                        : lastNameFocused
                                        ? "border-primary-400"
                                        : "border-gray-400"
                                } rounded-sm items-center`}
                            >
                                <input
                                    type="text"
                                    {...register("lastName")}
                                    placeholder="Enter your last name"
                                    className="text-[1rem] text-primary-900 font-normal bg-transparent outline-none w-full"
                                    onFocus={() => setLastNameFocused(true)}
                                    onBlur={() => setLastNameFocused(false)}
                                />
                            </div>
                            {errors.lastName && (
                                <p className="text-error-main text-sm">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {/* TODO: add link */}
                <p className="text-[1rem] text-gray-300">Privacy Policy</p>
            </div>

            {/* Bottom Part */}
            <div className="flex justify-center gap-4">
                <button
                    type="button"
                    className="w-[7rem] h-[2.1875rem] bg-white rounded-md items-center justify-center text-primary-400 border-1 border-primary-400 text-[16px] cursor-pointer hover:opacity-90"
                    onClick={() => router.push("/registration/email")}
                >
                    Back
                </button>
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
