import Navbar from "@components/Navbar";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col bg-primary-50 w-full min-h-screen items-center justify-top">
            <Navbar />
            {children}
        </div>
    );
}
