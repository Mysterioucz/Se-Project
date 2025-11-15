"use client";

import { PassengerData } from "@/src/contexts/checkout/types";
import {
    initialBaggageAllowance,
    initialSeatSelection,
    useCheckout,
} from "@/src/contexts/CheckoutContext";
import ListChoice from "@components/list_choice";
import Select from "@components/select";
import TextFieldComponent from "@components/text_field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface InformationCardProps {
    international?: boolean;
    passengerNum?: number;
    passengerData?: PassengerData;
}

const genderOptions = [{ value: "Male" }, { value: "Female" }];

const FYI = {
    1: "Please enter the name exactly as it appears on your travel documents for check-in. If the name is incorrect, you may not be able to board your flight and a cancellation fee will be charged.",
    2: "To ensure your trip goes smoothly, please make sure that the passenger's travel document is valid for at least 6 months from the date the trip ends.",
    domestic:
        "Please enter your birthdate in the format DD/MM/YYYY (e.g., 05/09/2000, Year in CE).",
    international:
        "Please enter your birthdate, passport issue date, passport expiry date in the format DD/MM/YYYY (e.g., 05/09/2000, Year in CE).",
};

// Base schema for domestic flights
const basePassengerSchema = z.object({
    givenName: z.string().min(1, "Given name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.string().min(1, "Gender is required"),
    dateOfBirth: z
        .string()
        .min(1, "Date of birth is required")
        .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format")
        .refine((date) => {
            const [day, month, year] = date.split("/");
            return !isNaN(Date.parse(`${year}-${month}-${day}`));
        }, "Invalid date"),
    nationality: z.string().min(1, "Nationality is required"),
});

// Extended schema for international flights
const internationalPassengerSchema = basePassengerSchema.extend({
    passportNo: z.string().min(1, "Passport number is required"),
    issueDate: z
        .string()
        .min(1, "Issue date is required")
        .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format")
        .refine((date) => {
            const [day, month, year] = date.split("/");
            return !isNaN(Date.parse(`${year}-${month}-${day}`));
        }, "Invalid date"),
    expiryDate: z
        .string()
        .min(1, "Expiry date is required")
        .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Date must be in DD/MM/YYYY format")
        .refine((date) => {
            const [day, month, year] = date.split("/");
            return !isNaN(Date.parse(`${year}-${month}-${day}`));
        }, "Invalid date"),
});

type PassengerFormData = z.infer<typeof basePassengerSchema> & {
    passportNo?: string;
    issueDate?: string;
    expiryDate?: string;
};

export default function InformationCard({
    international,
    passengerNum,
    passengerData,
}: InformationCardProps) {
    const { updatePassengerAt, updateCheckoutData, checkoutData } =
        useCheckout();

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isValid },
    } = useForm<PassengerFormData>({
        resolver: zodResolver(
            international ? internationalPassengerSchema : basePassengerSchema,
        ),
        mode: "onChange",
        defaultValues: {
            givenName: passengerData?.givenName || "",
            lastName: passengerData?.lastName || "",
            gender: passengerData?.gender || "",
            dateOfBirth: passengerData?.dateOfBirth || "",
            nationality: passengerData?.nationality || "",
            passportNo: passengerData?.passportNo || "",
            issueDate: passengerData?.issueDate || "",
            expiryDate: passengerData?.expiryDate || "",
        },
    });

    // Sync form values when passengerData prop changes
    useEffect(() => {
        if (passengerData) {
            setValue("givenName", passengerData.givenName || "");
            setValue("lastName", passengerData.lastName || "");
            setValue("gender", passengerData.gender || "");
            setValue("dateOfBirth", passengerData.dateOfBirth || "");
            setValue("nationality", passengerData.nationality || "");
            setValue("passportNo", passengerData.passportNo || "");
            setValue("issueDate", passengerData.issueDate || "");
            setValue("expiryDate", passengerData.expiryDate || "");
        }
    }, [passengerData, setValue]);

    useEffect(() => {
        if (isValid) {
            const prevValid = checkoutData.info?.isValid || false;
            if (passengerNum === 1) {
                updateCheckoutData({
                    info: {
                        isValid: isValid,
                    },
                });
            } else {
                updateCheckoutData({
                    info: {
                        isValid: prevValid && isValid,
                    },
                });
            }
        }
    }, [isValid]);

    const onSubmit = (data: PassengerFormData) => {
        const passengerData: PassengerData = {
            ...data,
            baggageAllowance: initialBaggageAllowance,
            seatSelection: initialSeatSelection,
        };
        if (passengerNum !== undefined) {
            updatePassengerAt(passengerNum - 1, passengerData);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-primary-50 flex w-[44.625rem] flex-col gap-8 rounded-lg p-6"
        >
            {/* Header */}
            <p className="!text-primary-900 !text-[2rem] !font-bold">
                Passenger {passengerNum} Info
            </p>
            {/* Content */}
            <div className="flex flex-row gap-2">
                <Controller
                    name="givenName"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col gap-1">
                            <TextFieldComponent
                                label="Given names*"
                                placeHolder="Enter your given names"
                                textValue={field.value}
                                width="w-[20.5625rem]"
                                height="h-[3.1875rem]"
                                labelFont="!font-normal"
                                labelSize="!text-[1rem]"
                                gap="gap-1"
                                error={!!errors.givenName}
                                onChange={(value) => {
                                    const upper =
                                        value !== null &&
                                        typeof value === "object" &&
                                        "text" in value
                                            ? (
                                                  value.text as string
                                              ).toUpperCase()
                                            : String(value ?? "").toUpperCase();
                                    field.onChange(upper);
                                }}
                            />
                            {errors.givenName && (
                                <p className="text-error-main text-sm">
                                    {errors.givenName.message}
                                </p>
                            )}
                        </div>
                    )}
                />
                <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col gap-1">
                            <TextFieldComponent
                                label="Lastname*"
                                placeHolder="Enter your lastname"
                                textValue={field.value}
                                width="w-[20.5625rem]"
                                height="h-[3.1875rem]"
                                labelFont="!font-normal"
                                labelSize="!text-[1rem]"
                                gap="gap-1"
                                error={!!errors.lastName}
                                onChange={(value) => {
                                    const upper =
                                        value !== null &&
                                        typeof value === "object" &&
                                        "text" in value
                                            ? (
                                                  value.text as string
                                              ).toUpperCase()
                                            : String(value ?? "").toUpperCase();
                                    field.onChange(upper);
                                }}
                            />
                            {errors.lastName && (
                                <p className="text-error-main text-sm">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            </div>
            {/* Personal Information */}
            <div className="flex flex-row gap-2">
                {/* gender */}
                <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col gap-1">
                            <p className="!text-primary-900 !text-[1rem]">
                                Gender on ID*
                            </p>
                            <Select
                                labelId="gender-label"
                                id="gender"
                                value={field.value}
                                placeholder="Select your gender"
                                width="w-[13.5625rem]"
                                height="h-[3.1875rem]"
                                error={!!errors.gender}
                            >
                                <ListChoice
                                    maxHeight="max-h-[5.375rem]"
                                    options={genderOptions}
                                    onChange={(event) =>
                                        field.onChange(
                                            event.target.value as string,
                                        )
                                    }
                                />
                            </Select>
                            {errors.gender && (
                                <p className="text-error-main text-sm">
                                    {errors.gender.message}
                                </p>
                            )}
                        </div>
                    )}
                />
                {/* Date of Birth */}
                <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col gap-1">
                            <TextFieldComponent
                                label="Date of Birth*"
                                placeHolder="DD/MM/YYYY"
                                textValue={field.value}
                                width="w-[13.5625rem]"
                                height="h-[3.1875rem]"
                                labelFont="!font-normal"
                                labelSize="!text-[1rem]"
                                gap="gap-1"
                                error={!!errors.dateOfBirth}
                                onChange={(value) => {
                                    const input =
                                        value !== null &&
                                        typeof value === "object" &&
                                        "text" in value
                                            ? (value.text as string)
                                            : String(value ?? "");
                                    field.onChange(input);
                                }}
                            />
                            {errors.dateOfBirth && (
                                <p className="text-error-main text-sm">
                                    {errors.dateOfBirth.message}
                                </p>
                            )}
                        </div>
                    )}
                />
                {/* Nationality */}
                <Controller
                    name="nationality"
                    control={control}
                    render={({ field }) => (
                        <div className="flex flex-col gap-1">
                            <p className="!text-primary-900 !text-[1rem]">
                                Nationality*
                            </p>
                            <Select
                                labelId="nationality-label"
                                id="nationality"
                                value={field.value}
                                placeholder="Select your nationality"
                                width="w-[13.5625rem]"
                                height="h-[3.1875rem]"
                                error={!!errors.nationality}
                            >
                                <ListChoice
                                    maxHeight="max-h-[191px]"
                                    options={[
                                        { value: "Thailand" },
                                        { value: "United States" },
                                        { value: "China" },
                                        { value: "Japan" },
                                        { value: "India" },
                                        // ... add more countries as needed
                                    ]}
                                    onChange={(event) => {
                                        field.onChange(
                                            event.target.value as string,
                                        );
                                    }}
                                />
                            </Select>
                            {errors.nationality && (
                                <p className="text-error-main text-sm">
                                    {errors.nationality.message}
                                </p>
                            )}
                        </div>
                    )}
                />
            </div>
            {/* Only show for international flights */}
            {international && (
                <div className="flex flex-col gap-2">
                    <p className="!text-primary-600 !text-[1rem]">
                        Passport Info
                    </p>
                    <div className="flex flex-row gap-2">
                        <Controller
                            name="passportNo"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-1">
                                    <TextFieldComponent
                                        label="Passport No.*"
                                        placeHolder="Enter your passport no."
                                        textValue={field.value || ""}
                                        width="w-[13.5625rem]"
                                        height="h-[3.1875rem]"
                                        labelFont="!font-normal"
                                        labelSize="!text-[1rem]"
                                        gap="gap-1"
                                        error={!!errors.passportNo}
                                        onChange={(value) => {
                                            const input =
                                                value !== null &&
                                                typeof value === "object" &&
                                                "text" in value
                                                    ? (value.text as string)
                                                    : String(value ?? "");
                                            field.onChange(input);
                                        }}
                                    />
                                    {errors.passportNo && (
                                        <p className="text-error-main text-sm">
                                            {errors.passportNo.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="issueDate"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-1">
                                    <TextFieldComponent
                                        label="Issue Date*"
                                        placeHolder="DD/MM/YYYY"
                                        textValue={field.value || ""}
                                        width="w-[13.5625rem]"
                                        height="h-[3.1875rem]"
                                        labelFont="!font-normal"
                                        labelSize="!text-[1rem]"
                                        gap="gap-1"
                                        error={!!errors.issueDate}
                                        onChange={(value) => {
                                            const input =
                                                value !== null &&
                                                typeof value === "object" &&
                                                "text" in value
                                                    ? (value.text as string)
                                                    : String(value ?? "");
                                            field.onChange(input);
                                        }}
                                    />
                                    {errors.issueDate && (
                                        <p className="text-error-main text-sm">
                                            {errors.issueDate.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                        <Controller
                            name="expiryDate"
                            control={control}
                            render={({ field }) => (
                                <div className="flex flex-col gap-1">
                                    <TextFieldComponent
                                        label="Expiry Date*"
                                        placeHolder="DD/MM/YYYY"
                                        textValue={field.value || ""}
                                        width="w-[13.5625rem]"
                                        height="h-[3.1875rem]"
                                        labelFont="!font-normal"
                                        labelSize="!text-[1rem]"
                                        gap="gap-1"
                                        error={!!errors.expiryDate}
                                        onChange={(value) => {
                                            const input =
                                                value !== null &&
                                                typeof value === "object" &&
                                                "text" in value
                                                    ? (value.text as string)
                                                    : String(value ?? "");
                                            field.onChange(input);
                                        }}
                                    />
                                    {errors.expiryDate && (
                                        <p className="text-error-main text-sm">
                                            {errors.expiryDate.message}
                                        </p>
                                    )}
                                </div>
                            )}
                        />
                    </div>
                </div>
            )}
            {/* FYI */}
            <div className="flex flex-col gap-1">
                <p className="!text-primary-600 !text-[0.875rem]">- {FYI[1]}</p>
                <p className="!text-primary-600 !text-[0.875rem]">
                    - {international ? FYI.international : FYI.domestic}
                </p>
                <p className="!text-primary-600 !text-[0.875rem]">- {FYI[2]}</p>
            </div>
            {/* Footer */}
            <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 h-[2.1875rem] w-full rounded-lg font-semibold text-white transition-colors"
            >
                Save
            </button>
        </form>
    );
}
