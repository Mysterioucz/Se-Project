// src/app/(user)/order-history/layout.tsx
import Navbar from "@/src/components/Navbar";

export default async function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // handle missing data as required (redirect, defaults, etc.)
    return (
        <div className="flex min-h-screen flex-col items-center gap-8">
            <Navbar />
            <div className="flex w-full px-32">{children}</div>
        </div>
    );
}
