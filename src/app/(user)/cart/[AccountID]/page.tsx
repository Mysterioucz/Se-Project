import CartClient from "./_components/CartClient";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import getCart from "@/src/lib/getCart";

interface PageProps {
    params: Promise<{ AccountID: string }>;
}

export default async function CartPage({ params }: PageProps) {
    const { AccountID } = await params; // get ID from URL

    // Get logged-in user session
    const session = await getServerSession(nextAuthOptions);

    // If not logged in → redirect to login
    if (!session) {
        redirect("/login");
    }

    const sessionAccountID = session.user.id;

    if (sessionAccountID !== AccountID) {
        return (
            <div className="text-red-600 text-center mt-8 text-xl font-bold">
                You do not have permission to access this cart.
            </div>
        );
    }

    const res = await getCart(AccountID);
    const cartData = res.data;

    return <CartClient initialCartData={cartData} AccountID={sessionAccountID}/>;
}