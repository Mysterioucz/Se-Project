"use client";

import SvgArrowLeft from "@/components/icons/arrowLeft.svg";
import { useRouter } from "next/navigation";

export default function RegistrationSuccess() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center gap-8 pt-8">
            <div className="flex flex-col items-center justify-center py-6 gap-8 border-1 border-black border-dashed rounded-lg w-[34.5rem] h-[12.625rem]">
                <div className="flex items-center justify-center w-[44px] h-[44px] text-success-main text-[1.5rem] border-1 border-success-main rounded-full p-2.5">
                    ✓
                </div>
                <div className="flex flex-col items-center justify-center gap-3">
                    <p className="text-[2.125rem] text-success-main">
                        Successfully Signed Up !
                    </p>
                    <p className="text-[1rem] text-gray-300">
                        You’ve already signed up! Log in to continue.
                    </p>
                </div>
            </div>
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="flex w-[10.875rem] h-[2.25rem] p-2 gap-4 bg-primary-600 rounded-md items-center justify-center text-white text-[16px] cursor-pointer hover:opacity-90"
                    onClick={() => router.push("/login")}
                >
                    <SvgArrowLeft />
                    <p className="flex items-center justify-center">
                        Back to login
                    </p>
                </button>
            </div>
        </div>
    );
}
