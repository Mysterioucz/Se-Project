import prisma from "@/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "PUT") {
        return new Response(
            JSON.stringify({ success: false, error: "Method Not Allowed" }),
            { status: 405 }
        );
    }

    const accountId = req.query.accountId as string;
    const { FirstName, LastName } = req.body;

    if (!FirstName && !LastName) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "Please provide at least one field to update (FirstName or LastName).",
            }),
            { status: 400 }
        );
    }

    try {
        const updatedUser = await prisma.account.update({
            where: { AccountID: accountId },
            data: { FirstName, LastName },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: updatedUser,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error",
            }),
            { status: 500 }
        );
    }
}
