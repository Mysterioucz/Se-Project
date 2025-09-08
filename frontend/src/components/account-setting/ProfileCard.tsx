"use client";

import React from "react";
import Image from "next/image";
import Button from "@components/Button";
import Modal from "@components/Modal";
import { TextField_Temp, DropdownSelector_Temp } from "./tempComponent";
import Link from "next/link";
import ModalDeleteAccount from "@components/modals/modal_delete_account";
import ModalSignOut from "@components/modals/modal_sign_out";

export default function ProfileCard() {
    const [isSignOutModalOpen, setIsSignOutModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

    return (
        <div className="flex flex-col px-[2.5rem] gap-[1.5rem] w-full">
            <h2 className="text-[2.5rem] font-bold text-[var(--color-primary-900)]">
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
                    <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">
                        user@example.com
                    </p>
                </div>
                <div className="flex flex-col gap-[2rem]">
                    <div className="flex flex-col gap-[0.75rem]">
                        <div className="flex flex-row gap-[3.5rem]">
                            {/* TODO: Replace here with Chat's Text Fill Box that can be edit by click Pencil Icon.
                            In Edit mode >> If user done to edit user has to pressed 'Enter' to save data in Database via backend, then return back to Display mode */}
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">
                                    First Name
                                </p>
                                <TextField_Temp />
                            </div>
                            {/* TODO: Replace here with Chat's Text Fill Box as same as detail with above!*/}
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">
                                    Last Name
                                </p>
                                <TextField_Temp />
                            </div>
                        </div>
                        <div className="flex flex-row gap-[3.5rem]">
                            {/* TODO: Replace here with Chat's Dropdown Selector that has Language choices which fetch from Backend*/}
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <p className="text-[1.125rem] text-[var(--color-primary-900)] font-semibold">
                                    Language
                                </p>
                                <DropdownSelector_Temp />
                            </div>
                            {/* Donot delete this! Just empty space for pretty style */}
                            <div className="flex flex-1 flex-col gap-[0.75rem]"></div>
                        </div>
                    </div>
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
                </div>
            </div>
        </div>
    );
}
