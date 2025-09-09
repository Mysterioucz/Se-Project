"use client";

import Link from "next/link";
import Image from 'next/image';
import Button from "./Button";
import { useState } from "react";

interface NavbarProps {
    isSignIn: boolean;
    displayName?: string;
}

export default function Navbar({ isSignIn, displayName }: NavbarProps) {
  const [clicked, setClicked] = useState(false);

  return (
    <nav className="bg-[var(--color-primary-400)] flex mb-[1.5rem] items-center w-full justify-between py-[var(--spacing-sm)] px-[var(--spacing-xl)] sticky top-0 z-99">
      {/* Navigate to main page */}
      <Link href="">
        <Image
          src={"/logo/logo_nobg_white.svg"}
          alt="White Logo"
          width={50}
          height={50}
          className="w-[3.125rem] h-[3.125rem]"          />
      </Link>
      <div className="flex items-center gap-[var(--spacing-xl)]">
        {/* Navigate to Customer Support page */}
        <Link href="">
          <p className="text-white text-[var(--text-body)] cursor-pointer">
            Customer Support
          </p>
        </Link>
        {/* Navigate to Cart page */}
        <Link href="">
          <Image
            src={"/navbar/fi-br-shopping-cart.svg"}
            alt="Cart"
            width={20}
            height={20}
            className="w-[1.25rem] h-[1.25rem] cursor-pointer"
          />
        </Link>
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
