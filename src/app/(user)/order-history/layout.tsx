import Navbar from "@/src/components/Navbar";
import { CheckoutProvider } from "@/src/contexts/CheckoutContext";

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen gap-8 items-center">
            <Navbar />            
            <div className="flex w-full px-32">
            <CheckoutProvider>{children}</CheckoutProvider>
            </div>
        </div>
    );
}
