import CheckoutProgress from "@/src/app/(user)/checkout/_components/CheckoutProgress";
import PriceSummary from "@/src/app/(user)/checkout/_components/PriceSummary";
import PriceSummaryLoading from "@/src/app/(user)/checkout/_components/PriceSummaryLoading";
import Navbar from "@/src/components/Navbar";
import { Suspense } from "react";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen gap-8 items-center">
            <Navbar />
            <CheckoutProgress />
            <div className="flex w-full px-32">{children}</div>
            <Suspense fallback={<PriceSummaryLoading />}>
                <PriceSummary />
            </Suspense>
        </div>
    );
}
