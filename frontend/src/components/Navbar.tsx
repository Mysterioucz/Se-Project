"use client";

import Button from "./Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavbarProps } from "./Helper";

export default function Navbar({ isSignIn, displayName }: NavbarProps) {
  const router = useRouter();
  const [clicked, setClicked] = useState(false);

  const goTo = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="bg-[var(--color-primary-400)] flex items-center w-full justify-between py-[var(--spacing-sm)] px-[var(--spacing-xl)] sticky top-0">
      <img
        src="/logo/logo_nobg_white.svg"
        alt="Logo White"
        className="w-[3.125rem] h-[3.125rem] cursor-pointer"
        onClick={() => goTo("")} // Navigate to Main page
      />
      <div className="flex items-center gap-[var(--spacing-xl)]">
        <p
          className="text-white text-[var(--text-body)] cursor-pointer"
          onClick={() => goTo("")} // Navigate to Customer support
        >
          Customer Support
        </p>
        <img
          src="/navbar/fi-br-shopping-cart.svg"
          alt="Cart"
          className="w-[1.25rem] h-[1.25rem] cursor-pointer"
          onClick={() => goTo("")} // Navigate to Cart page
        />
        {isSignIn ? (
          <Button
            text={displayName ?? "Can't Fetch Name"}
            styleType="stroke"
            size="md"
            iconStart="/navbar/fi-sr-user.svg"
            href="" // Navigate to Profile page
            onClick={() => setClicked(!clicked)}
          />
        ) : (
          <Button
            text="Sign in / Register"
            styleType="stroke"
            size="md"
            iconStart="/navbar/fi-sr-user.svg"
            href="" // Navigate to Signin / Register page
            onClick={() => setClicked(!clicked)}
          />
        )}
      </div>
    </nav>
  );
}
