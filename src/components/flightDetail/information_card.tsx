'use client';

import TextFieldComponent from "@components/text_field";
import Select from "@components/select";
import ListChoice from "@components/list_choice";
import { useState } from "react";
import Button from "@components/Button";

interface InformationCardProps {
    international?: boolean;
    number?: string;
}

const genderOptions = [
    { value: "Male" },
    { value: "Female" }
];

const FYI = {
    1: 'Please enter the name exactly as it appears on your travel documents for check-in. If the name is incorrect, you may not be able to board your flight and a cancellation fee will be charged.',
    2: "To ensure your trip goes smoothly, please make sure that the passenger's travel document is valid for at least 6 months from the date the trip ends.",
    domestic: 'Please enter your birthdate in the format DD/MM/YYYY (e.g., 05/09/2000, Year in CE).',
    international: 'Please enter your birthdate, passport issue date, passport expiry date in the format DD/MM/YYYY (e.g., 05/09/2000, Year in CE).'
};

export default function InformationCard(props: InformationCardProps) {
    const [givenName, setGivenName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");

    const [gender, setGender] = useState<string>("");
    const [dateOfBirth, setDateOfBirth] = useState<string>("");
    const [nationality, setNationality] = useState<string>("");

    const [passportNo, setPassportNo] = useState<string>("");
    const [issueDate, setIssueDate] = useState<string>("");
    const [expiryDate, setExpiryDate] = useState<string>("");

    return (
        <div className="flex flex-col w-[44.625rem] p-6 gap-8 rounded-lg bg-primary-50">
            {/* Header */}
            <p className="!font-bold !text-[2rem] !text-primary-900">Passenger {props.number} Info</p>
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
                        onChange={
                            (value) => {
                                const upper =
                                    value !== null && typeof value === "object" && "text" in value
                                        ? (value.text as string).toUpperCase()
                                        : String(value ?? "").toUpperCase();
                                    setGivenName(upper);
                            }
                        }
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
                        onChange={
                            (value) => {
                                const upper =
                                    value !== null && typeof value === "object" && "text" in value
                                        ? (value.text as string).toUpperCase()
                                        : String(value ?? "").toUpperCase();
                                    setLastName(upper);
                            }
                        }
                    />
            </div>
            {/* Personal Information */}
            <div className="flex flex-row gap-2">
                {/* gender */}
                <div className="flex flex-col gap-1">
                    <p className="!text-[1rem] !text-primary-900">Gender on ID*</p>
                    <Select
                        labelId="gender-label"
                        id="gender"
                        value={gender}
                        placeholder="Select your gender"
                        width="w-[13.5625rem]"
                        height="h-[3.1875rem]"
                    >
                        <ListChoice 
                            maxHeight="max-h-[5.375rem]"
                            options={genderOptions}
                            onChange={(event) => setGender(event.target.value as string)}
                        />
                    </Select>
                </div> 
                 {/* Date of Birth */}
                    <TextFieldComponent 
                        label="Date of Birth*"
                        placeHolder="DD/MM/YYYY"
                        textValue=""
                        width="w-[13.5625rem]"
                        height="h-[3.1875rem]"
                        labelFont="!font-normal"
                        labelSize="!text-[1rem]"
                        gap="gap-1"
                    />
                {/* Nationality */}
                <div className="flex flex-col gap-1">
                    <p className="!text-[1rem] !text-primary-900">Nationality*</p>
                    <Select
                        labelId="nationality-label"
                        id="nationality"
                        value={nationality}
                        placeholder="Select your nationality"
                        width="w-[13.5625rem]"
                        height="h-[3.1875rem]"
                    >
                        <ListChoice
                            maxHeight="max-h-[191px]"
                            options={[
                                { value: "Thailand" },
                                { value: "United States" },
                                { value: "China" },
                                { value: "Japan" },
                                { value: "India" }
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
            {props.international &&
                <div className="flex flex-col gap-2">
                    <p className="!text-[1rem] !text-primary-600">Passport Info</p>
                    <div className="flex flex-row gap-2">
                        <TextFieldComponent
                            label="Passport No.*"
                            placeHolder="Enter your passport no."
                            textValue=""
                            width="w-[13.5625rem]"
                            height="h-[3.1875rem]"
                            labelFont="!font-normal"
                            labelSize="!text-[1rem]"
                            gap="gap-1"
                        />
                        <TextFieldComponent
                            label="Issue Date*"
                            placeHolder="DD/MM/YYYY"
                            textValue=""
                            width="w-[13.5625rem]"
                            height="h-[3.1875rem]"
                            labelFont="!font-normal"
                            labelSize="!text-[1rem]"
                            gap="gap-1"
                        />
                        <TextFieldComponent
                            label="Expiry Date*"
                            placeHolder="DD/MM/YYYY"
                            textValue=""
                            width="w-[13.5625rem]"
                            height="h-[3.1875rem]"
                            labelFont="!font-normal"
                            labelSize="!text-[1rem]"
                            gap="gap-1"
                        />
                    </div>
                </div>
            }
            {/* FYI */}
            <div className="flex flex-col gap-1">
                <p className="!text-[0.875rem] !text-primary-600">- {FYI[1]}</p>
                <p className="!text-[0.875rem] !text-primary-600">- {props.international ? FYI.international : FYI.domestic}</p>
                <p className="!text-[0.875rem] !text-primary-600">- {FYI[2]}</p>
            </div>
            {/* Footer */}
            <Button
                text="Save"
                width="w-full"
                height="h-[2.1875rem]"
                size="md"
            />
        </div>
    );
}