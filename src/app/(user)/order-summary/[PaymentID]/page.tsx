import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PageClient from "../_components/pageClient";

interface PageProps {
    params: Promise<{ PaymentID: string }>;
}

export default async function Page({ params }: PageProps) {
    // Get logged-in user session
    const session = await getServerSession(nextAuthOptions);

    // If not logged in → redirect to login
    if (!session) {
        redirect("/login");
    }

    const sessionAccountID = session.user.id;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const { PaymentID } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments/${PaymentID}`,
        {
            method: "GET",
            headers: {
                Cookie: cookieHeader, // send session cookies
            },
        },
    ).then((res) => res.json());
    const data = res.data;

    return <PageClient data={data} UserAccountID={sessionAccountID} />;
}
