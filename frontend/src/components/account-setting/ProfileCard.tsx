"use client";

import React from "react";
import Image from "next/image";
import Button from "@components/Button";
import Modal from "@components/Modal";
import { TextField_Temp, DropdownSelector_Temp } from "./tempComponent";
<<<<<<< HEAD
import Button from "../Button";
import TextFieldComponent from "../text_field";
import SelectComponent from "../select";
=======
import Link from "next/link";
import ModalDeleteAccount from "@components/modals/modal_delete_account";
import ModalSignOut from "@components/modals/modal_sign_out";
>>>>>>> feat/account-setting

export default function ProfileCard() {
    const [isSignOutModalOpen, setIsSignOutModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

    return (
        <div className="flex flex-col px-[2.5rem] gap-[1.5rem] w-full">
<<<<<<< HEAD
            <h2 className="text-[2.5rem] font-bold leading-[3rem] text-[var(--color-Primary-900)]">
=======
            <h2 className="text-[2.5rem] font-bold text-[var(--color-primary-900)]">
>>>>>>> feat/account-setting
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
<<<<<<< HEAD
                    <p className="font-sarabun text-[1.125rem] font-semibold leading-[120%] text-[var(--color-gray-900)]">
=======
                    <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">
>>>>>>> feat/account-setting
                        user@example.com
                    </p>
                </div>
                <div className="flex flex-col gap-[2rem]">
                    <div className="flex flex-col gap-[0.75rem]">
                        <div className="flex flex-row gap-[3.5rem]">
                            {/* TODO: Replace here with Chat's Text Fill Box that can be edit by click Pencil Icon.
                            In Edit mode >> If user done to edit user has to pressed 'Enter' to save data in Database via backend, then return back to Display mode */}
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
<<<<<<< HEAD
                                <p className="text-[1.125rem] text-[var(--color-Primary-900)] font-semibold">First Name</p>
=======
                                <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">
                                    First Name
                                </p>
>>>>>>> feat/account-setting
                                <TextField_Temp />
                            </div>
                            {/* TODO: Replace here with Chat's Text Fill Box as same as detail with above!*/}
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
<<<<<<< HEAD
                                <p className="text-[1.125rem] text-[var(--color-Primary-900)] font-semibold">Last Name</p>
=======
                                <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">
                                    Last Name
                                </p>
>>>>>>> feat/account-setting
                                <TextField_Temp />
                            </div>
                        </div>
                        <div className="flex flex-row gap-[3.5rem]">
                            {/* TODO: Replace here with Chat's Dropdown Selector that has Language choices which fetch from Backend*/}
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
<<<<<<< HEAD
                                <p className="text-[1.125rem] text-[var(--color-Primary-900)] font-semibold">Language</p>
=======
                                <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">
                                    Language
                                </p>
>>>>>>> feat/account-setting
                                <DropdownSelector_Temp />
                            </div>
                            {/* Donot delete this! Just empty space for pretty style */}
                            <div className="flex flex-1 flex-col gap-[0.75rem]"></div>
                        </div>
                    </div>
<<<<<<< HEAD
                    <div className="flex flex-col gap-[0.75rem]">
                        <Button text="Sign Out" align="center" styleType="fill" size="md" width="w-full" height="h-[2.1875rem]" onClick={() => console.log("Sign Out clicked")} />
                        <Button text="Delete Account" align="center" styleType="red-critical" size="md" width="w-full" height="h-[2.1875rem]" onClick={() => console.log("Delete Account clicked")} />
                    </div>
=======
                    <Button
                        text="Sign Out"
                        onClick={() => setIsSignOutModalOpen(true)}
                        styleType="fill"
                        width="w-full"
                    ></Button>
                    <ModalSignOut
                        isOpen={isSignOutModalOpen}
                        onClose={() => setIsSignOutModalOpen(false)}
                    />
                    {/* TODO: Replace here with Button Component & Setup for preapre to sync with backend */}
                    <Button
                        text="Delete Account"
                        onClick={() => setIsDeleteModalOpen(true)}
                        styleType="danger"
                        width="w-full"
                    ></Button>
                    <ModalDeleteAccount
                        isOpen={isDeleteModalOpen}
                        onClose={() => {
                            console.log("Close delete modal");
                            setIsDeleteModalOpen(false);
                        }}
                    />
                    {/* <div className="w-full px-[1rem] py-[0.5rem] rounded-[0.5rem] border-1 border-[var(--color-error-main)] text-center bg-[var(--color-common-white)]">
                            <p className="text-[var(--color-error-main)] text-[1rem]">Delete Account</p>
                        </div> */}
>>>>>>> feat/account-setting
                </div>
            </div>
        </div>
    );
}
