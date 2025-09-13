import Navbar from "@components/Navbar";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col bg-primary-50 w-full min-h-screen items-center justify-top">
            <Navbar />
            <div className="flex flex-col w-full h-full px-[10rem]">{children}</div>
        </div>
    );
}
