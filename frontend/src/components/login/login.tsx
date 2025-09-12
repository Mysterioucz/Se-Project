"use client";

import { saveRegistrationData } from "@components/registration/registration_data";
import SvgOpenEye from "@components/icons/openEye.svg";
import SvgCloseEye from "@components/icons/closeEye.svg";
import Button from "@components/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

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
            callbackUrl: "/dashboard",
        }).then((res) => {
            if (res?.error) {
                // Handle errors based on the error message
                setLoginError(true);
            } else {
                // Reset error states on successful sign-in
                setLoginError(false);
                router.push("/flights/search");
            }
        });
    }

    return (
        <div className="flex flex-col items-center justify-center gap-8">
            {/* Top Part */}
            <p className="text-[3rem] font-bold text-primary-900">Sign In</p>

            {/* Email Part */}

            <div className="flex flex-col gap-3">
                <p
                    className={`text-[1.125rem] font-semibold ${
                        loginError ? "text-error-main" : "text-primary-900"
                    }`}
                >
                    Email Address*
                </p>
                <div className="flex flex-col gap-2">
                    <div
                        className={`flex gap-2.5 p-4 w-[34.5rem] h-[3.1875rem] border-1 ${
                            loginError
                                ? "border-error-main"
                                : emailFocused
                                ? "border-primary-400"
                                : "border-gray-400"
                        } rounded-sm items-center`}
                    >
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="text-[1rem] text-primary-900 font-normal bg-transparent outline-none w-full"
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
                            className={`text-[1.125rem] font-semibold ${
                                loginError
                                    ? "text-error-main"
                                    : "text-primary-900"
                            }`}
                        >
                            Password*
                        </p>
                        <div
                            className={`flex gap-2.5 p-4 w-[34.5rem] h-[3.1875rem] border-1 justify-between ${
                                loginError
                                    ? "border-error-main"
                                    : passwordFocused
                                    ? "border-primary-400"
                                    : "border-gray-400"
                            } rounded-sm items-center`}
                        >
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                placeholder="Enter your password"
                                className="text-[1rem] text-primary-900 font-normal bg-transparent outline-none w-full"
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
                        <p className="text-error-main text-[1rem]">
                            Invalid Email or Password
                        </p>
                    )}
                    {/* TODO: implement onClick (Goto reset password page) */}
                    <p className="text-primary-500 text-[1rem] cursor-pointer">
                        Forget Password?
                    </p>
                </div>
            </div>

            {/* Bottom Part */}
            <div className="flex flex-col gap-3 items-center justify-center">
                {/* TODO: implement onClick */}
                <Button
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
