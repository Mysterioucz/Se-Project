"use client";

import Button from "@components/Button";
import SvgCloseEye from "@components/icons/closeEye.svg";
import SvgOpenEye from "@components/icons/openEye.svg";
import { saveRegistrationData } from "@components/registration/registration_data";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegistrationEmail() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    async function handleSignIn() {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        }).then((res) => {
            if (res?.error) {
                // Handle errors based on the error message
                setLoginError(true);
            } else {
                // Reset error states on successful sign-in
                setLoginError(false);
                router.push("/");
            }
        });
    }

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            {/* Top Part */}
            <p className="!text-primary-900 !text-[3rem] !font-bold">Sign In</p>

            {/* Email Part */}

            <div className="flex flex-col gap-3">
                <p
                    className={`!text-[1.125rem] !font-semibold ${
                        loginError ? "!text-error-dark" : "!text-primary-900"
                    }`}
                >
                    Email Address*
                </p>
                <div className="flex flex-col gap-2">
                    <div
                        className={`flex h-[3.1875rem] w-[34.5rem] gap-2.5 border-1 p-4 ${
                            loginError
                                ? "border-error-main"
                                : emailFocused
                                  ? "border-primary-400"
                                  : "border-gray-400"
                        } items-center rounded-sm`}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="text-primary-900 w-full bg-transparent text-[1rem] font-normal outline-none"
                            onFocus={() => setEmailFocused(true)}
                            onBlur={() => setEmailFocused(false)}
                        />
                    </div>
                </div>
            </div>

            {/* Password Part */}
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-3">
                        <p
                            className={`!text-[1.125rem] !font-semibold ${
                                loginError
                                    ? "!text-error-dark"
                                    : "!text-primary-900"
                            }`}
                        >
                            Password*
                        </p>
                        <div
                            className={`flex h-[3.1875rem] w-[34.5rem] justify-between gap-2.5 border-1 p-4 ${
                                loginError
                                    ? "border-error-main"
                                    : passwordFocused
                                      ? "border-primary-400"
                                      : "border-gray-400"
                            } items-center rounded-sm`}
                        >
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                placeholder="Enter your password"
                                className="text-primary-900 w-full bg-transparent text-[1rem] font-normal outline-none"
                                onFocus={() => setPasswordFocused(true)}
                                onBlur={() => setPasswordFocused(false)}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div
                                className="cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <SvgCloseEye />
                                ) : (
                                    <SvgOpenEye />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row justify-between">
                    {loginError && (
                        <p className="!text-error-main !text-[1rem]">
                            Invalid Email or Password
                        </p>
                    )}
                    {/* TODO: implement onClick (Goto reset password page) */}
                    <p className="!text-primary-500 cursor-pointer !text-[1rem]">
                        Forget Password?
                    </p>
                </div>
            </div>

            {/* Bottom Part */}
            <div className="flex flex-col items-center justify-center gap-3">
                {/* TODO: implement onClick */}
                <Button
                    data-testid="signin"
                    text="Sign In"
                    styleType="fill"
                    size="md"
                    width="w-[15rem]"
                    onClick={() => handleSignIn()}
                />
                <Button
                    text="Sign Up"
                    styleType="stroke"
                    size="md"
                    width="w-[15rem]"
                    onClick={() => {
                        // Clear previous registration data
                        saveRegistrationData({
                            email: "",
                            firstName: "",
                            lastName: "",
                            password: "",
                        });
                        router.push("/registration/email");
                    }}
                />
            </div>
        </div>
    );
}
