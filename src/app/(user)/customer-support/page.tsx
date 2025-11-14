"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import AttachmentInput from "@/src/components/AttachmentInput";
import Button from "@/src/components/Button";
import Navbar from "@/src/components/Navbar";
import TextAreaComponent from "@/src/components/TextAreaComponent";
import TextFieldComponent from "@/src/components/text_field";
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

    const [attachment, setAttachment] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitData, setSubmitData] = useState<SupportFormData | null>(null);

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

    const onValidSubmit = async (data: SupportFormData) => {
        if (!session?.user?.id) {
            setSubmitError("You must be logged in to submit a report");
            return;
        }
        
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitData(data);
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = async () => {
        setIsModalOpen(false);
        try {
            // Convert attachment to base64 if present
            let attachmentBase64 = "";
            if (attachment) {
                const reader = new FileReader();
                attachmentBase64 = await new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(attachment);
                });
            }
            const data = submitData!;
            const response = await fetch("/api/v1/reports", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    description: data.description,
                    paymentId: data.bookingId,
                    attachment: attachmentBase64,
                    telno: data.phoneNumber,
                    email: data.email,
                    passengerFirstName: data.givenNames,
                    passengerLastName: data.givenLastname,
                    priority: data.priorityLevel,
                    problemType: data.problemType,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to submit report");
            }
            
            // On success, redirect or show success message
            router.push("/");
        } catch (error) {
            console.error("Error submitting report:", error);
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
        setIsSubmitting(false);
        setIsModalOpen(false);
    };
    const handleAttachmentChange = (file: File | null) => {
        setAttachment(file);
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
                        onSubmit={handleSubmit(onValidSubmit)}
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

                            {/* Attachment */}
                            <AttachmentInput
                                label="Attachment"
                                value={attachment}
                                onChange={handleAttachmentChange}
                                containerClassName="md:col-span-2"
                            />
                        </div>

                        {submitError && (
                            <div className="text-error-main bg-error-light rounded-md p-3 text-sm">
                                {submitError}
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
            />
        </div>
    );
}
