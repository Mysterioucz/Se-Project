"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import { z } from "zod";

import Navbar from "@/src/components/Navbar";
import ContactUs from "./_component/ContactUs";
import ResponseTime from "./_component/ResponseTime";
import PriorityLevelSelect from "./_component/PrioritySelect";
import ProblemTypeSelect from "./_component/ProblemTypeSelect";
import ConfirmSubmitModal from "./_component/ConfirmSubmitModal";
import TextAreaComponent from "@/src/components/TextAreaComponent";
import TextFieldComponent from "@/src/components/text_field";
import Button from "@/src/components/Button";
import AttachmentInput from '@/src/components/AttachmentInput';

const supportSchema = z.object({
    priorityLevel: z.string().nonempty("Level is Required"),
    problemType: z.string().nonempty("Problem Type is Required"),
    bookingId: z.string().nonempty("Booking ID is Required"),
    email: z.string().nonempty("Email is Required").email("Invalid email address"),
    phoneNumber: z.string().nonempty("Phone Number is Required").min(9, "Invalid phone number"),
    givenNames: z.string().nonempty("Given Names is Required").min(2, "Name is too short"),
    givenLastname: z.string().nonempty("Last Name is Required").min(2, "Last name is too short"),
    description: z.string().nonempty("Description is Required").min(1, "Please provide more detail"),
});

type SupportFormData = z.infer<typeof supportSchema>;

export default function Page() {
    const router = useRouter();

    const [attachment, setAttachment] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // React Hook Form (RHF)
    const { 
        control, 
        handleSubmit, 
        formState: { errors, isValid } 
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

    const onValidSubmit = (data: SupportFormData) => {
        console.log("Form Data Valid:", data);
        // TODO: POST report to backend
        setIsModalOpen(true);
    };

    const handleConfirmSubmit = () => {
        console.log("Submitting to API");
        setIsModalOpen(false);
        router.push("/"); 
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleAttachmentChange = (file: File | null) => {
        setAttachment(file);
    };

    return (
        <div className="flex flex-col h-dvh">
            <Navbar />
            {/* Main content */}
            <div className="mx-[6.25rem] mt-[1.25rem] flex flex-col gap-[2rem]">
                {/* Header */}
                <div className="flex flex-col gap-[1rem]">
                    <h1 className="text-[3rem] font-bold leading-[3rem] text-[var(--color-primary-900)] pt-4">
                        Customer Support
                    </h1>
                    <p className="text-[1rem] text-[var(--color-primary-600)]">
                        How can we help you ?
                    </p>
                </div>
                {/* Content */}
                <div className="flex gap-[2rem] mb-10">
                    <form 
                        onSubmit={handleSubmit(onValidSubmit)}
                        className="grow-[5] basis-0 flex flex-col gap-[1.5rem]"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1.5rem] gap-y-4">

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
                                            <p className="text-error-main text-sm mt-1 ml-2">
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
                                            <p className="text-error-main text-sm mt-1 ml-2">
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
                                            onChange={(value) => field.onChange(value.text)} 
                                            placeHolder="Enter Booking ID (Ex.f47ac10b-58cc-4372-a567-0e02b2c3d479)"
                                            labelFont="!font-semibold"
                                            labelSize="!text-lg"
                                            labelColor="!text-gray-700"
                                            gap="gap-2"
                                            error={fieldState.invalid}
                                            helperText={fieldState.error?.message}
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
                                        onChange={(value) => field.onChange(value.text)}
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
                                        onChange={(value) => field.onChange(value.text)}
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
                                        onChange={(value) => field.onChange(value.text)}
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
                                        onChange={(value) => field.onChange(value.text)}
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

                        <div className="flex justify-end gap-4 mt-4">
                            <Button
                                text="Back"
                                align="center"
                                styleType="stroke"
                                size="md"
                                width="w-full"
                                height="h-[2.625rem]"
                                onClick={() => router.back()}
                            />
                            <Button
                                text="Submit"
                                align="center"
                                styleType="fill"
                                size="md"
                                width="w-full"
                                height="h-[2.625rem]"
                                disabled={!isValid}
                            />
                        </div>

                    </form>

                    {/* Right: Display our Info */}
                    <div className="grow-[2] basis-0 flex flex-col gap-[2rem] h-fit">
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