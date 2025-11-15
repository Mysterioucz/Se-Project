"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/src/components/Button";
import Navbar from "@/src/components/Navbar";
import TextAreaComponent from "@/src/components/TextAreaComponent";
import TextFieldComponent from "@/src/components/text_field";
import {
    getErrorColor,
    ReportErrorMessages,
    ReportErrorType,
} from "@/src/enums/ReportErrorTypes";
import ConfirmSubmitModal from "./_component/ConfirmSubmitModal";
import ContactUs from "./_component/ContactUs";
import PriorityLevelSelect from "./_component/PrioritySelect";
import ProblemTypeSelect from "./_component/ProblemTypeSelect";
import ResponseTime from "./_component/ResponseTime";

const supportSchema = z.object({
    priorityLevel: z.string().nonempty("Level is Required"),
    problemType: z.string().nonempty("Problem Type is Required"),
    bookingId: z.string().nonempty("Booking ID is Required"),
    email: z
        .string()
        .nonempty("Email is Required")
        .email("Invalid email address"),
    phoneNumber: z
        .string()
        .nonempty("Phone Number is Required")
        .min(9, "Invalid phone number"),
    givenNames: z
        .string()
        .nonempty("Given Names is Required")
        .min(2, "Name is too short"),
    givenLastname: z
        .string()
        .nonempty("Last Name is Required")
        .min(2, "Last name is too short"),
    description: z
        .string()
        .nonempty("Description is Required")
        .min(1, "Please provide more detail"),
});

type SupportFormData = z.infer<typeof supportSchema>;

export default function Page() {
    const router = useRouter();
    const { data: session } = useSession();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [errorType, setErrorType] = useState<ReportErrorType | null>(null);
    const [pendingFormData, setPendingFormData] =
        useState<SupportFormData | null>(null);

    // React Hook Form (RHF)
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<SupportFormData>({
        resolver: zodResolver(supportSchema),
        mode: "onChange",
        defaultValues: {
            priorityLevel: "",
            problemType: "",
            bookingId: "",
            email: "",
            phoneNumber: "",
            givenNames: "",
            givenLastname: "",
            description: "",
        },
    });

    // This function just opens the modal and stores the data
    const handleFormSubmit = (data: SupportFormData) => {
        if (!session?.user?.id) {
            setSubmitError("You must be logged in to submit a report");
            setErrorType(ReportErrorType.AUTHENTICATION);
            return;
        }

        // Clear previous errors
        setSubmitError(null);
        setErrorType(null);

        // Store form data and open confirmation modal
        setPendingFormData(data);
        setIsModalOpen(true);
    };

    // This function is called when user confirms in the modal
    const handleConfirmSubmit = async () => {
        if (!pendingFormData) return;

        setIsSubmitting(true);

        try {

            const response = await fetch("/api/v1/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    description: pendingFormData.description,
                    paymentId: pendingFormData.bookingId,
                    telno: pendingFormData.phoneNumber,
                    email: pendingFormData.email,
                    passengerFirstName: pendingFormData.givenNames,
                    passengerLastName: pendingFormData.givenLastname,
                    priority: pendingFormData.priorityLevel,
                    problemType: pendingFormData.problemType,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                // Set error type for specific error handling
                setErrorType(result.errorCode || ReportErrorType.UNKNOWN);
                throw new Error(result.message || "Failed to submit report");
            }

            // Success - close modal and redirect
            setIsModalOpen(false);
            router.push("/");
        } catch (error) {
            console.error("Error submitting report:", error);

            // Close modal to show error on form
            setIsModalOpen(false);

            // Set user-friendly error message
            setSubmitError(
                error instanceof Error
                    ? error.message
                    : "Failed to submit report. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPendingFormData(null);
    };

    return (
        <div className="flex h-dvh flex-col">
            <Navbar />
            {/* Main content */}
            <div className="mx-[6.25rem] mt-[1.25rem] flex flex-col gap-[2rem]">
                {/* Header */}
                <div className="flex flex-col gap-[1rem]">
                    <h1 className="pt-4 text-[3rem] leading-[3rem] font-bold text-[var(--color-primary-900)]">
                        Customer Support
                    </h1>
                    <p className="text-[1rem] text-[var(--color-primary-600)]">
                        How can we help you ?
                    </p>
                </div>
                {/* Content */}
                <div className="mb-10 flex gap-[2rem]">
                    <form
                        onSubmit={handleSubmit(handleFormSubmit)}
                        className="flex grow-[5] basis-0 flex-col gap-[1.5rem]"
                    >
                        <div className="grid grid-cols-1 gap-x-[1.5rem] gap-y-4 md:grid-cols-2">
                            {/* Priority Level */}
                            <Controller
                                name="priorityLevel"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <div className="flex flex-col gap-1">
                                        <PriorityLevelSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        {fieldState.error && (
                                            <p className="text-error-main mt-1 ml-2 text-sm">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            {/* Problem Type */}
                            <Controller
                                name="problemType"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <div className="flex flex-col gap-1">
                                        <ProblemTypeSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                        {fieldState.error && (
                                            <p className="text-error-main mt-1 ml-2 text-sm">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />

                            {/* Booking ID */}
                            <div className="md:col-span-2">
                                <Controller
                                    name="bookingId"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextFieldComponent
                                            label="Booking ID*"
                                            name={field.name}
                                            textValue={field.value}
                                            onChange={(value) =>
                                                field.onChange(value.text)
                                            }
                                            placeHolder="Enter Booking ID (Ex.f47ac10b-58cc-4372-a567-0e02b2c3d479)"
                                            labelFont="!font-semibold"
                                            labelSize="!text-lg"
                                            labelColor="!text-gray-700"
                                            gap="gap-2"
                                            error={fieldState.invalid}
                                            helperText={
                                                fieldState.error?.message
                                            }
                                        />
                                    )}
                                />
                            </div>

                            {/* Email */}
                            <Controller
                                name="email"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextFieldComponent
                                        label="Email*"
                                        name={field.name}
                                        textValue={field.value}
                                        onChange={(value) =>
                                            field.onChange(value.text)
                                        }
                                        placeHolder="Enter Your Email"
                                        labelFont="!font-semibold"
                                        labelSize="!text-lg"
                                        labelColor="!text-gray-700"
                                        gap="gap-2"
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />

                            {/* Phone Number */}
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextFieldComponent
                                        label="Phone Number*"
                                        name={field.name}
                                        textValue={field.value}
                                        onChange={(value) =>
                                            field.onChange(value.text)
                                        }
                                        placeHolder="Enter Your Phone Number"
                                        labelFont="!font-semibold"
                                        labelSize="!text-lg"
                                        labelColor="!text-gray-700"
                                        gap="gap-2"
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />

                            {/* Given Psg Name */}
                            <Controller
                                name="givenNames"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextFieldComponent
                                        label="Main Passenger Given Name*"
                                        name={field.name}
                                        textValue={field.value}
                                        onChange={(value) =>
                                            field.onChange(value.text)
                                        }
                                        placeHolder="Enter Your Given Name"
                                        labelFont="!font-semibold"
                                        labelSize="!text-lg"
                                        labelColor="!text-gray-700"
                                        gap="gap-2"
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />

                            {/* Given Psg Lastname */}
                            <Controller
                                name="givenLastname"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextFieldComponent
                                        label="Main Passenger Lastname*"
                                        name={field.name}
                                        textValue={field.value}
                                        onChange={(value) =>
                                            field.onChange(value.text)
                                        }
                                        placeHolder="Enter Your Last Name"
                                        labelFont="!font-semibold"
                                        labelSize="!text-lg"
                                        labelColor="!text-gray-700"
                                        gap="gap-2"
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />

                            {/* Description */}
                            <Controller
                                name="description"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <TextAreaComponent
                                        label="Description*"
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Describe your issue in detail..."
                                        containerClassName="md:col-span-2"
                                        error={fieldState.invalid}
                                        helperText={fieldState.error?.message}
                                    />
                                )}
                            />

                        </div>

                        {submitError && errorType && (
                            <div
                                className="rounded-md border-l-4 p-4 shadow-sm"
                                style={{
                                    backgroundColor:
                                        getErrorColor(errorType).bg,
                                    borderColor:
                                        getErrorColor(errorType).border,
                                }}
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        {errorType ===
                                        ReportErrorType.DUPLICATE_REPORT ? (
                                            <svg
                                                className="h-5 w-5 text-yellow-600"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                className="h-5 w-5 text-red-600"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="ml-3 flex-1">
                                        <h3
                                            className="text-sm font-medium"
                                            style={{
                                                color: getErrorColor(errorType)
                                                    .text,
                                            }}
                                        >
                                            {ReportErrorMessages[errorType]}
                                        </h3>
                                        <div
                                            className="mt-2 text-sm"
                                            style={{
                                                color:
                                                    errorType ===
                                                    ReportErrorType.DUPLICATE_REPORT
                                                        ? "#78350F"
                                                        : "#7F1D1D",
                                            }}
                                        >
                                            {submitError}
                                        </div>
                                        {errorType ===
                                            ReportErrorType.DUPLICATE_REPORT && (
                                            <div
                                                className="mt-2 text-sm"
                                                style={{ color: "#78350F" }}
                                            >
                                                <strong>Need help?</strong>{" "}
                                                Contact our support team to
                                                update your existing report.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 flex justify-end gap-4">
                            <Button
                                text="Back"
                                align="center"
                                styleType="stroke"
                                size="md"
                                width="w-full"
                                height="h-[2.625rem]"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                            />
                            <Button
                                text={isSubmitting ? "Submitting..." : "Submit"}
                                align="center"
                                styleType="fill"
                                size="md"
                                width="w-full"
                                height="h-[2.625rem]"
                                disabled={!isValid || isSubmitting}
                            />
                        </div>
                    </form>

                    {/* Right: Display our Info */}
                    <div className="flex h-fit grow-[2] basis-0 flex-col gap-[2rem]">
                        <ContactUs />
                        <ResponseTime />
                    </div>
                </div>
            </div>

            {/* Modal */}
            <ConfirmSubmitModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmSubmit}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
