"use client";

import { PassengerData, useCheckout } from "@/src/contexts/CheckoutContext";
import Button from "@components/Button";
import ListChoice from "@components/list_choice";
import Select from "@components/select";
import TextFieldComponent from "@components/text_field";
import { useEffect, useState } from "react";

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

export default function InformationCard({
    international,
    passengerNum,
    passengerData,
}: InformationCardProps) {
    const { updatePassengerAt } = useCheckout();

    const [givenName, setGivenName] = useState<string>(
        passengerData?.givenName || "",
    );
    const [errorGivenName, setErrorGivenName] = useState<boolean>(false);
    const [lastName, setLastName] = useState<string>(
        passengerData?.lastName || "",
    );
    const [errorLastName, setErrorLastName] = useState<boolean>(false);

    const [gender, setGender] = useState<string>(passengerData?.gender || "");
    const [errorGender, setErrorGender] = useState<boolean>(false);
    const [dateOfBirth, setDateOfBirth] = useState<string>(
        passengerData?.dateOfBirth || "",
    );
    const [errorDateOfBirth, setErrorDateOfBirth] = useState<boolean>(false);
    const [nationality, setNationality] = useState<string>(
        passengerData?.nationality || "",
    );
    const [errorNationality, setErrorNationality] = useState<boolean>(false);

    const [passportNo, setPassportNo] = useState<string>(
        passengerData?.passportNo || "",
    );
    const [errorPassportNo, setErrorPassportNo] = useState<boolean>(false);
    const [issueDate, setIssueDate] = useState<string>(
        passengerData?.issueDate || "",
    );
    const [errorIssueDate, setErrorIssueDate] = useState<boolean>(false);
    const [expiryDate, setExpiryDate] = useState<string>(
        passengerData?.expiryDate || "",
    );
    const [errorExpiryDate, setErrorExpiryDate] = useState<boolean>(false);

    // Sync local state when passengerData prop changes (from context)
    useEffect(() => {
        if (passengerData) {
            setGivenName(passengerData.givenName || "");
            setLastName(passengerData.lastName || "");
            setGender(passengerData.gender || "");
            setDateOfBirth(passengerData.dateOfBirth || "");
            setNationality(passengerData.nationality || "");
            setPassportNo(passengerData.passportNo || "");
            setIssueDate(passengerData.issueDate || "");
            setExpiryDate(passengerData.expiryDate || "");
        }
    }, [passengerData]);

    const handleSaveButtonClick = () => {
        if (givenName === "") {
            // TODO: send error
            console.log("Given name is empty");
            setErrorGivenName(true);
        } else {
            setErrorGivenName(false);
        }
        if (lastName === "") {
            // TODO: send error
            console.log("Last name is empty");
            setErrorLastName(true);
        } else {
            setErrorLastName(false);
        }
        if (gender === "") {
            // TODO: send error
            console.log("Gender is empty");
            setErrorGender(true);
        } else {
            setErrorGender(false);
        }
        if (dateOfBirth === "") {
            // TODO: send error
            console.log("Date of birth is empty");
            setErrorDateOfBirth(true);
        } else {
            setErrorDateOfBirth(false);
        }
        if (nationality === "") {
            // TODO: send error
            console.log("Nationality is empty");
            setErrorNationality(true);
        } else {
            setErrorNationality(false);
        }

        if (international) {
            if (passportNo === "") {
                // TODO: send error
                console.log("Passport no is empty");
                setErrorPassportNo(true);
            } else {
                setErrorPassportNo(false);
            }
            if (issueDate === "") {
                // TODO: send error
                console.log("Issue date is empty");
                setErrorIssueDate(true);
            } else {
                setErrorIssueDate(false);
            }
            if (expiryDate === "") {
                // TODO: send error
                console.log("Expiry date is empty");
                setErrorExpiryDate(true);
            } else {
                setErrorExpiryDate(false);
            }
        }

        const [dayOfBirth, monthOfBirth, yearOfBirth] = dateOfBirth.split("/");
        const [dayOfIssue, monthOfIssue, yearOfIssue] = issueDate.split("/");
        const [dayOfExpiry, monthOfExpiry, yearOfExpiry] =
            expiryDate.split("/");
        if (isNaN(Date.parse(`${yearOfBirth}-${monthOfBirth}-${dayOfBirth}`))) {
            console.log("Invalid date of birth");
            setErrorDateOfBirth(true);
        } else {
            setErrorDateOfBirth(false);
        }
        if (international) {
            if (
                isNaN(
                    Date.parse(`${yearOfIssue}-${monthOfIssue}-${dayOfIssue}`),
                )
            ) {
                console.log("Invalid issue date");
                setErrorIssueDate(true);
            } else {
                setErrorIssueDate(false);
            }
            if (
                isNaN(
                    Date.parse(
                        `${yearOfExpiry}-${monthOfExpiry}-${dayOfExpiry}`,
                    ),
                )
            ) {
                console.log("Invalid expiry date");
                setErrorExpiryDate(true);
            } else {
                setErrorExpiryDate(false);
            }
        }

        const info: {
            givenName: string;
            lastName: string;
            gender: string;
            dateOfBirth: string;
            nationality: string;
            passportNo?: string;
            dayOfIssue?: string;
            monthOfIssue?: string;
            yearOfIssue?: string;
            dayOfExpiry?: string;
            monthOfExpiry?: string;
            yearOfExpiry?: string;
        } = {
            givenName,
            lastName,
            gender,
            dateOfBirth,
            nationality,
        };
        if (international) {
            info.passportNo = passportNo;
            info.dayOfIssue = dayOfIssue;
            info.monthOfIssue = monthOfIssue;
            info.yearOfIssue = yearOfIssue;
            info.dayOfExpiry = dayOfExpiry;
            info.monthOfExpiry = monthOfExpiry;
            info.yearOfExpiry = yearOfExpiry;
        }

        if (
            errorGivenName ||
            errorLastName ||
            errorGender ||
            errorDateOfBirth ||
            errorNationality ||
            errorPassportNo ||
            errorIssueDate ||
            errorExpiryDate
        ) {
            console.log("Please fix the errors before saving.");
            return;
        } else {
            if (passengerNum !== undefined) {
                updatePassengerAt(
                    passengerNum - 1,
                    info as unknown as PassengerData,
                );
            }
            console.log(info);
        }
    };

    return (
        <div className="flex flex-col w-[44.625rem] p-6 gap-8 rounded-lg bg-primary-50">
            {/* Header */}
            <p className="!font-bold !text-[2rem] !text-primary-900">
                Passenger {passengerNum} Info
            </p>
            {/* Content */}
            <div className="flex flex-row gap-2">
                <TextFieldComponent
                    label="Given names*"
                    placeHolder="Enter your given names"
                    textValue={givenName}
                    width="w-[20.5625rem]"
                    height="h-[3.1875rem]"
                    labelFont="!font-normal"
                    labelSize="!text-[1rem]"
                    gap="gap-1"
                    error={errorGivenName}
                    onChange={(value) => {
                        const upper =
                            value !== null &&
                            typeof value === "object" &&
                            "text" in value
                                ? (value.text as string).toUpperCase()
                                : String(value ?? "").toUpperCase();
                        setGivenName(upper);
                    }}
                />
                <TextFieldComponent
                    label="Lastname*"
                    placeHolder="Enter your lastname"
                    textValue={lastName}
                    width="w-[20.5625rem]"
                    height="h-[3.1875rem]"
                    labelFont="!font-normal"
                    labelSize="!text-[1rem]"
                    gap="gap-1"
                    error={errorLastName}
                    onChange={(value) => {
                        const upper =
                            value !== null &&
                            typeof value === "object" &&
                            "text" in value
                                ? (value.text as string).toUpperCase()
                                : String(value ?? "").toUpperCase();
                        setLastName(upper);
                    }}
                />
            </div>
            {/* Personal Information */}
            <div className="flex flex-row gap-2">
                {/* gender */}
                <div className="flex flex-col gap-1">
                    <p className="!text-[1rem] !text-primary-900">
                        Gender on ID*
                    </p>
                    <Select
                        labelId="gender-label"
                        id="gender"
                        value={gender}
                        placeholder="Select your gender"
                        width="w-[13.5625rem]"
                        height="h-[3.1875rem]"
                        error={errorGender}
                    >
                        <ListChoice
                            maxHeight="max-h-[5.375rem]"
                            options={genderOptions}
                            onChange={(event) =>
                                setGender(event.target.value as string)
                            }
                        />
                    </Select>
                </div>
                {/* Date of Birth */}
                <TextFieldComponent
                    label="Date of Birth*"
                    placeHolder="DD/MM/YYYY"
                    textValue={dateOfBirth}
                    width="w-[13.5625rem]"
                    height="h-[3.1875rem]"
                    labelFont="!font-normal"
                    labelSize="!text-[1rem]"
                    gap="gap-1"
                    error={errorDateOfBirth}
                    onChange={(value) => {
                        const input =
                            value !== null &&
                            typeof value === "object" &&
                            "text" in value
                                ? (value.text as string)
                                : String(value ?? "");
                        setDateOfBirth(input);
                    }}
                />
                {/* Nationality */}
                <div className="flex flex-col gap-1">
                    <p className="!text-[1rem] !text-primary-900">
                        Nationality*
                    </p>
                    <Select
                        labelId="nationality-label"
                        id="nationality"
                        value={nationality}
                        placeholder="Select your nationality"
                        width="w-[13.5625rem]"
                        height="h-[3.1875rem]"
                        error={errorNationality}
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
                                setNationality(event.target.value as string);
                            }}
                        />
                    </Select>
                </div>
            </div>
            {/* Only show for international flights */}
            {international && (
                <div className="flex flex-col gap-2">
                    <p className="!text-[1rem] !text-primary-600">
                        Passport Info
                    </p>
                    <div className="flex flex-row gap-2">
                        <TextFieldComponent
                            label="Passport No.*"
                            placeHolder="Enter your passport no."
                            textValue={passportNo}
                            width="w-[13.5625rem]"
                            height="h-[3.1875rem]"
                            labelFont="!font-normal"
                            labelSize="!text-[1rem]"
                            gap="gap-1"
                            error={errorPassportNo}
                            onChange={(value) => {
                                const input =
                                    value !== null &&
                                    typeof value === "object" &&
                                    "text" in value
                                        ? (value.text as string)
                                        : String(value ?? "");
                                setPassportNo(input);
                            }}
                        />
                        <TextFieldComponent
                            label="Issue Date*"
                            placeHolder="DD/MM/YYYY"
                            textValue={issueDate}
                            width="w-[13.5625rem]"
                            height="h-[3.1875rem]"
                            labelFont="!font-normal"
                            labelSize="!text-[1rem]"
                            gap="gap-1"
                            error={errorIssueDate}
                            onChange={(value) => {
                                const input =
                                    value !== null &&
                                    typeof value === "object" &&
                                    "text" in value
                                        ? (value.text as string)
                                        : String(value ?? "");
                                setIssueDate(input);
                            }}
                        />
                        <TextFieldComponent
                            label="Expiry Date*"
                            placeHolder="DD/MM/YYYY"
                            textValue={expiryDate}
                            width="w-[13.5625rem]"
                            height="h-[3.1875rem]"
                            labelFont="!font-normal"
                            labelSize="!text-[1rem]"
                            gap="gap-1"
                            error={errorExpiryDate}
                            onChange={(value) => {
                                const input =
                                    value !== null &&
                                    typeof value === "object" &&
                                    "text" in value
                                        ? (value.text as string)
                                        : String(value ?? "");
                                setExpiryDate(input);
                            }}
                        />
                    </div>
                </div>
            )}
            {/* FYI */}
            <div className="flex flex-col gap-1">
                <p className="!text-[0.875rem] !text-primary-600">- {FYI[1]}</p>
                <p className="!text-[0.875rem] !text-primary-600">
                    - {international ? FYI.international : FYI.domestic}
                </p>
                <p className="!text-[0.875rem] !text-primary-600">- {FYI[2]}</p>
            </div>
            {/* Footer */}
            <Button
                text="Save"
                width="w-full"
                height="h-[2.1875rem]"
                size="md"
                onClick={handleSaveButtonClick}
            />
        </div>
    );
}
