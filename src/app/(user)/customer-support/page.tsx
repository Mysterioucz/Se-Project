"use client";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import ContactUs from "./_component/ContactUs";
import ResponseTime from "./_component/ResponseTime";
import PriorityLevelSelect from "./_component/PrioritySelect";
import ProblemTypeSelect from "./_component/ProblemTypeSelect";
import ConfirmSubmitModal from "./_component/ConfirmSubmitModal";
import TextAreaComponent from "@/src/components/TextAreaComponent";
import TextFieldComponent from "@/src/components/text_field";
import { TextFieldValue } from "@/src/components/text_field";
import Button from "@/src/components/Button";
import AttachmentInput from '@/src/components/AttachmentInput';

export default function Page() {
    const router = useRouter();

    const [priorityLevel, setPriorityLevel] = useState("");
    const [problemType, setProblemType] = useState("");

    const [bookingId, setBookingId] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [givenNames, setGivenNames] = useState("");
    const [givenLastname, setGivenLastname] = useState("");
    const [description, setDescription] = useState("");
    const [attachment, setAttachment] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirmSubmit = () => {
        // TODO: POST report to backend
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
                    {/* Left: Fill Info */}
                    <div className="grow-[5] basis-0 flex flex-col gap-[1.5rem]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[1.5rem] gap-y-4">

                            {/* Priority Level */}
                            <PriorityLevelSelect
                                value={priorityLevel}
                                onChange={(e) => setPriorityLevel(e.target.value as string)}
                            />

                            {/* Problem Type */}
                            <ProblemTypeSelect
                                value={problemType}
                                onChange={(e) => setProblemType(e.target.value as string)}
                            />

                            {/* Booking ID */}
                            <div className="md:col-span-2">
                                <TextFieldComponent
                                    label="Booking ID"
                                    name="bookingId"
                                    textValue={bookingId}
                                    onChange={(value: TextFieldValue) => setBookingId(value.text)}
                                    placeHolder="Enter Booking ID (Ex.f47ac10b-58cc-4372-a567-0e02b2c3d479)"
                                    labelFont="!font-semibold"
                                    labelSize="!text-lg"
                                    labelColor="!text-gray-700"
                                    gap="gap-2"
                                />
                            </div>
                            {/* Email */}
                            <TextFieldComponent
                                label="Email*"
                                name="email"
                                textValue={email}
                                onChange={(value: TextFieldValue) => setEmail(value.text)}
                                placeHolder="Enter Your Email"
                                labelFont="!font-semibold"
                                labelSize="!text-lg"
                                labelColor="!text-gray-700"
                                gap="gap-2"
                            />
                            {/* Phone Number */}
                            <TextFieldComponent
                                label="Phone Number*"
                                name="phoneNumber"
                                textValue={phoneNumber}
                                onChange={(value: TextFieldValue) => {
                                    setPhoneNumber(value.text);
                                }}
                                placeHolder="Enter Your Phone Number"
                                labelFont="!font-semibold"
                                labelSize="!text-lg"
                                labelColor="!text-gray-700"
                                gap="gap-2"
                            />
                            {/* Given psg Name */}
                            <TextFieldComponent
                                label="Main Passenger Given Name*"
                                name="givenNames"
                                textValue={givenNames}
                                onChange={(value: TextFieldValue) => setGivenNames(value.text)}
                                placeHolder="Enter Your Given Name"
                                labelFont="!font-semibold"
                                labelSize="!text-lg"
                                labelColor="!text-gray-700"
                                gap="gap-2"
                            />
                            {/* Given psg Lastname */}
                            <TextFieldComponent
                                label="Main Passenger Lastname*"
                                name="lastname"
                                textValue={givenLastname}
                                onChange={(value: TextFieldValue) => setGivenLastname(value.text)}
                                placeHolder="Enter Your Last Name"
                                labelFont="!font-semibold"
                                labelSize="!text-lg"
                                labelColor="!text-gray-700"
                                gap="gap-2"
                            />

                            {/* Description */}
                            <TextAreaComponent
                                label="Description*"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your issue in detail..."
                                containerClassName="md:col-span-2"
                            />

                            {/* Attachment */}
                            <AttachmentInput
                            label="Attachment"
                            value={attachment}
                            onChange={handleAttachmentChange}
                            containerClassName="md:col-span-2"
                        />
                        </div>

                        {/* TODO: Implement Button */}
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
                                onClick={() => setIsModalOpen(true)}
                            />
                        </div>

                    </div>

                    {/* Right: Display our Info */}
                    <div className="grow-[2] basis-0 flex flex-col gap-[2rem] h-fit">
                        <ContactUs />
                        <ResponseTime />
                    </div>
                </div>
            </div>
            <ConfirmSubmitModal
                open={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmSubmit}
            />
        </div>
    );
}