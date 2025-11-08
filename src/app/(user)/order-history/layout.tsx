// src/app/(user)/order-history/layout.tsx
import Navbar from "@/src/components/Navbar";
import { CheckoutProvider } from "@/src/contexts/CheckoutContext";

export default async function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Example: fetch cart and flight from an API or database
    const cartRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, { cache: "no-store" });
    const cartData = cartRes.ok ? await cartRes.json() : null;

    const departRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/depart-flight`, { cache: "no-store" });
    const departFlight = departRes.ok ? await departRes.json() : null;

    // handle missing data as required (redirect, defaults, etc.)
    return (
        <div className="flex flex-col min-h-screen gap-8 items-center">
            <Navbar />
            <div className="flex w-full px-32">
                <CheckoutProvider cartData={cartData} departFlight={departFlight}>
                    {children}
                </CheckoutProvider>
            </div>
        </div>
    );
}