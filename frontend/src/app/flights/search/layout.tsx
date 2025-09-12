import Navbar from "@/src/components/Navbar";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(nextAuthOptions);
    return (
        <div className="flex flex-col">
            <Navbar
                isSignIn={!!session}
                displayName={session?.user?.name as string}
            />
            {children}
        </div>
    );
}
