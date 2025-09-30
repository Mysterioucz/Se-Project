import { nextAuthOptions } from "@/src/lib/auth";
import Navbar from "@components/Navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(nextAuthOptions);
    if (session?.user) {
        redirect("/");
    }
    return (
        <section className="flex flex-col h-screen">
            <Navbar />
            {children}
        </section>
    );
}
