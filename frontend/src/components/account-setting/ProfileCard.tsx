"use client";

import React from "react";
import Image from "next/image";
import Button from "../Button";
import Modal from "@components/Modal";
import { TextField_Temp, DropdownSelector_Temp } from "./tempComponent";
import TextFieldComponent from "../text_field";
import SelectComponent from "../select";
import { MenuItem } from "@mui/material";

export default function ProfileCard() {
    const [isSignOutModalOpen, setIsSignOutModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [language, setLanguage] = React.useState("");

    return (
        <div className="flex flex-col px-[2.5rem] gap-[1.5rem] w-full">
            <h2 className="text-[2.5rem] font-bold leading-[3rem] text-[var(--color-primary-900)]">
                Account Settings
            </h2>
            <div className="flex flex-col pb-[1.0rem] gap-[1.5rem]">
                <div className="flex flex-row gap-[1rem] justify-start items-center">
                    {/* Profile Image to fetch data from backend */}
                    <Image
                        src={"/profile-icon.svg"}
                        alt="Profile"
                        width={50}
                        height={50}
                        className="w-[3.125rem] h-[3.125rem]"
                    />
                    {/*fetch email data from Backend */}
                    <p className="font-sarabun text-[1.125rem] font-semibold leading-[120%] text-[var(--color-gray-900)]">
                        johndoe@example.com
                    </p>
                </div>
                <div className="flex flex-col gap-[2rem]">
                    <div className="flex flex-col gap-[0.75rem]">
                        <div className="flex flex-row gap-[3.5rem]">
                            {/* In Edit mode >> If user done to edit user has to pressed 'Enter' to save data in Database via backend, then return back to Display mode */}
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <TextFieldComponent
                                    label="First Name"
                                    textValue=""
                                    placeHolder="John"
                                    disabled={true}
                                    icon={<img src="/profile-card/fi-sr-pencil.svg" alt="toggle" className="w-5 h-5" />}
                                />
                            </div>
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <TextFieldComponent
                                    label="Last Name"
                                    textValue=""
                                    placeHolder="Doe"
                                    disabled={true}
                                    icon={<img src="/profile-card/fi-sr-pencil.svg" alt="toggle" className="w-5 h-5" />}
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-[3.5rem]">
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">Language</p>
                                <SelectComponent
                                    labelId="demo-select-label"
                                    id="demo-select"
                                    value={language==="" ? "Thai" : language}
                                    onChange={(e) => setLanguage((e.target as HTMLInputElement).value)}
                                    error={false}
                                    disabled={false}
                                >
                                    <MenuItem value="Thai">Thai</MenuItem>
                                    <MenuItem value="English">English</MenuItem>
                                </SelectComponent>
                            </div>
                            {/* Donot delete this! Just empty space for pretty style */}
                            <div className="flex flex-1 flex-col gap-[0.75rem]"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[0.75rem]">
                        <Button text="Sign Out" align="center" styleType="fill" size="md" width="w-full" height="h-[2.1875rem]" onClick={() => console.log("Sign Out clicked")} />
                        <Button text="Delete Account" align="center" styleType="red-critical" size="md" width="w-full" height="h-[2.1875rem]" onClick={() => console.log("Delete Account clicked")} />
                    </div>
                </div>
            </div>
        </div>
    );
}
