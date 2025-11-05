import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import PageClient, { PaymentsApiResponse } from "./_components/pageClient";
import { cookies } from "next/headers";

interface PageProps {
    params: Promise<{ AccountID: string }>;
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

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments?userId=${session.user.id}`, {
        method: "GET",
        headers: {
            Cookie: cookieHeader, // send session cookies
        },
    }).then((res) => res.json());
    const data = res.data;

    return <PageClient data={data} UserAccountID={sessionAccountID}/>;
}



// "use client";

// import React, { useEffect } from "react";
// import Button from "@/src/components/Button";
// import FlightDetailSummary from "@/src/components/paymentConfirmation/flightDetailSummary";
// import PassengerInfoSummary from "@/src/components/paymentConfirmation/passengerInfoSummary";
// import PaymentDetailSummary from "@/src/components/paymentConfirmation/paymentDetailSummary";
// import PriceBreakdownCard from "@/src/components/paymentConfirmation/priceBreakdownCard";
// import { PassengerTypes } from "@/src/enums/PassengerTypes";
// import { PaymentMethodTypes } from "@/src/enums/PaymentMethodTypes";
// import { FlightTypes } from "@/src/enums/FlightTypes";
// import { FlightLegTypes } from "@/src/enums/FlightLegTypes";
// import { redirect, useRouter } from "next/navigation";
// import { ErrorMessages } from "@/src/enums/ErrorMessages";
// import { nextAuthOptions } from "@/src/lib/auth";
// import { getServerSession } from "next-auth";