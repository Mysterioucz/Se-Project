import React from "react";
import Image from "next/image";
import { TextField_Temp, DropdownSelector_Temp } from "./tempComponent";
import Button from "../Button";

export default function ProfileCard() {
    return (
        <div className="flex flex-col px-[2.5rem] gap-[1.5rem] w-full">
            <h2 className="font-sans text-[2.5rem] font-bold leading-[3rem] text-[var(--color-primary-900)]">
                Account Settings
            </h2>
            <div className="flex flex-col pb-[1.0rem] gap-[1.5rem]">
                <div className="flex flex-row gap-[1rem] justify-start items-center">
                    {/* TODO: Implement Profile Image to fetch data from backend */}
                    <Image
                        src={"/profile-icon.svg"}
                        alt="Profile"
                        width={50}
                        height={50}
                        className="w-[3.125rem] h-[3.125rem]"
                    />
                    {/* TODO: Implement email to fetch data from Backend */}
                    <p className="font-sarabun text-[18px] font-semibold leading-[120%] text-[var(--color-gray-900)]">
                        user@example.com
                    </p>
                </div>
                <div className="flex flex-col gap-[2rem]">
                    <div className="flex flex-col gap-[0.75rem]">
                        <div className="flex flex-row gap-[3.5rem]">
                            {/* TODO: Replace here with Chat's Text Fill Box that can be edit by click Pencil Icon.
                            In Edit mode >> If user done to edit user has to pressed 'Enter' to save data in Database via backend, then return back to Display mode */}
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">First Name</p>
                                <TextField_Temp />
                            </div>
                            {/* TODO: Replace here with Chat's Text Fill Box as same as detail with above!*/}
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">Last Name</p>
                                <TextField_Temp />
                            </div>
                        </div>
                        <div className="flex flex-row gap-[3.5rem]">
                            {/* TODO: Replace here with Chat's Dropdown Selector that has Language choices which fetch from Backend*/}
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">Language</p>
                                <DropdownSelector_Temp />
                            </div>
                            {/* Donot delete this! Just empty space for pretty style */}
                            <div className="flex flex-1 flex-col gap-[0.75rem]"></div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[0.75rem]">
                        <Button text="Sign Out" align="center" styleType="fill" size="md" width="w-full" height="h-[35px]" onClick={() => console.log("Sign Out clicked")} />
                        <Button text="Delete Account" align="center" styleType="red-critical" size="md" width="w-full" height="h-[35px]" onClick={() => console.log("Sign Out clicked")} />
                    </div>
                </div>
            </div>
        </div>
    );
}