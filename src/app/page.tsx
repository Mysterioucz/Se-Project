import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { nextAuthOptions } from "../lib/auth";

export default async function Page() {
    const session = await getServerSession(nextAuthOptions);
    if (session?.user && session.isAdmin) {
        redirect("/dashboard");
    }
    redirect("/flights/search");
}
