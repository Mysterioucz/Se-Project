"use client";

import React from "react";
import Image from "next/image";
import Button from "../../../../components/Button";
import TextFieldComponent from "../../../../components/text_field";
import SelectComponent from "../../../../components/select";
import { MenuItem } from "@mui/material";
import { useSession } from "next-auth/react";
import ModalDeleteAccount from "@components/modals/modal_delete_account";
import ModalSignOut from "@components/modals/modal_sign_out";

export default function ProfileCard() {
    const { data: session, update: updateSession } = useSession();
    // console.log("Session data in ProfileCard:", session);
    const userEmail = session?.user?.email;
    const userFirstName = session?.user?.name?.split(" ")[0] ?? "";
    const userLastName = session?.user?.name?.split(" ")[1] ?? "";

    const [language, setLanguage] = React.useState("");
    const [isSignOutModalOpen, setIsSignOutModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [firstName, setFirstName] = React.useState(userFirstName);
    const [lastName, setLastName] = React.useState(userLastName);

    const accountId = session?.user?.id;

    // Function to update user name via API and refresh session
    async function updateName(
        updateFirstName?: string,
        updateLastName?: string
    ) {
        if (!accountId) return;

        try {
            const res = await fetch(`/api/v1/account/${accountId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ updateFirstName, updateLastName }),
            });

            const data = await res.json();
            if (res.ok) {
                // Update local state
                if (data.data.FirstName) setFirstName(data.data.FirstName);
                if (data.data.LastName) setLastName(data.data.LastName);

                // Refresh session so session.user.name updates immediately
                // console.log("Updating session with:", {
                //     user: {
                //         name: `${updateFirstName || firstName} ${
                //             updateLastName || lastName
                //         }`,
                //     },
                // });
                if (
                    data.data.FirstName !== firstName ||
                    data.data.LastName !== lastName
                ) {
                    updateSession({
                        user: {
                            name: `${updateFirstName || firstName} ${
                                updateLastName || lastName
                            }`,
                        },
                    });
                }
            } else {
                console.error("Failed to update:", data.message);
            }
        } catch (err) {
            console.error("Error updating user:", err);
        }
    }

    return (
        <div className="flex flex-col px-[2.5rem] gap-[1.5rem] w-full">
            <h2 className="!text-[2.5rem] !font-bold !leading-[3rem] !text-[var(--color-primary-900)]">
                Account Settings
            </h2>

            <div className="flex flex-col pb-[1rem] gap-[1.5rem]">
                <div className="flex flex-row gap-[1rem] justify-start items-center">
                    <Image
                        src={"/profile-icon.svg"}
                        alt="Profile"
                        width={50}
                        height={50}
                        className="w-[3.125rem] h-[3.125rem]"
                    />
                    <p className="!font-sarabun !text-[1.125rem] !font-semibold !not-italic !leading-[120%] !text-[var(--color-gray-900)]">
                        {String(userEmail) ?? "Can't Fetch Email"}
                    </p>
                </div>

                <div className="flex flex-col gap-[2rem]">
                    <div className="flex flex-col gap-[0.75rem]">
                        <div className="flex flex-row gap-[3.5rem]">
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <TextFieldComponent
                                    label="First Name"
                                    textValue={firstName}
                                    placeHolder={firstName}
                                    disabled={true}
                                    icon={
                                        <img
                                            src="/profile-card/fi-sr-pencil.svg"
                                            alt="toggle"
                                            className="w-5 h-5"
                                        />
                                    }
                                    onSubmit={(val) => {
                                        const { text } = val as {
                                            text: string;
                                        };
                                        updateName(text); // update first name only
                                    }}
                                />
                            </div>
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <TextFieldComponent
                                    label="Last Name"
                                    textValue={lastName}
                                    placeHolder={lastName}
                                    disabled={true}
                                    icon={
                                        <img
                                            src="/profile-card/fi-sr-pencil.svg"
                                            alt="toggle"
                                            className="w-5 h-5"
                                        />
                                    }
                                    onSubmit={(val) => {
                                        const { text } = val as {
                                            text: string;
                                        };
                                        updateName(undefined, text); // update last name only
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-row gap-[3.5rem]">
                            <div className="flex flex-1 flex-col gap-[0.75rem]">
                                <p className="!text-[1.125rem] !text-[var(--color-primary-900)] !font-semibold">
                                    Language
                                </p>
                                <SelectComponent
                                    labelId="demo-select-label"
                                    id="demo-select"
                                    value={
                                        language === "" ? "English" : language
                                    }
                                    onChange={(e) =>
                                        setLanguage(
                                            (e.target as HTMLInputElement).value
                                        )
                                    }
                                    error={false}
                                    disabled={false}
                                >
                                    <MenuItem value="English">English</MenuItem>
                                </SelectComponent>
                            </div>
                            <div className="flex flex-1 flex-col gap-[0.75rem]"></div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[0.75rem]">
                        <Button
                            text="Sign Out"
                            align="center"
                            styleType="fill"
                            size="md"
                            width="w-full"
                            height="h-[2.625rem]"
                            onClick={() => setIsSignOutModalOpen(true)}
                        />
                        <ModalSignOut
                            isOpen={isSignOutModalOpen}
                            onClose={() => setIsSignOutModalOpen(false)}
                        />
                        <Button
                            text="Delete Account"
                            align="center"
                            styleType="red-critical"
                            size="md"
                            width="w-full"
                            height="h-[2.625rem]"
                            onClick={() => setIsDeleteModalOpen(true)}
                        />
                        <ModalDeleteAccount
                            isOpen={isDeleteModalOpen}
                            onClose={() => setIsDeleteModalOpen(false)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
