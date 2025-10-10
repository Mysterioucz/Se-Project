import CheckoutProgress from "@/src/components/checkout/CheckoutProgress";
import Navbar from "@/src/components/Navbar";

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
        </div>
    );
}
