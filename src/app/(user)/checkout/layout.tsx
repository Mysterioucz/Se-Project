"use client";

import { usePathname } from "next/navigation";
import CheckoutProgress from "@/src/components/checkout/CheckoutProgress";
import PriceSummary from "@/src/components/checkout/PriceSummary";
import Navbar from "@/src/components/Navbar";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideProgress = pathname.includes("/checkout/payment/success");
  return (
    <div className="flex flex-col min-h-screen gap-8 items-center">
      <Navbar />
      {!hideProgress && <CheckoutProgress />}
      <div className="flex w-full px-32">{children}</div>
      {!hideProgress && <PriceSummary />}
    </div>
  );
}
