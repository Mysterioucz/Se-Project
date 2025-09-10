import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/db";

interface JwtPayload {
    AccountID: string;
    Email: string;
    FirstName: string;
    LastName: string;
}

export const authorize = async (req: NextRequest, roles: string[]) => {
    let token;
    // Check for token in the authorization header
    if (
        req.headers.has("authorization") &&
        req.headers.get("authorization")!.startsWith("Bearer")
    ) {
        token = req.headers.get("authorization")!.split(" ")[1]; // Get the token part
    }

    if (!token || token === null) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "Not authorized to access this route",
            }),
            { status: 401 }
        );
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const acc = await prisma.account.findUnique({
            where: { 
                AccountID: decoded.AccountID 
            }, // Match by AccountID
            include: {
                user: true,
                admin: true,
            },
        });

        if (! acc) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "Invalid Token",
                }),
                { status: 401 }
            );
        }

        let accountRole = '';
        if (acc.admin) {
            accountRole = 'Admin';
        } else if (acc.user) {
            accountRole = 'User';
        }

        // If the user’s role does not match any allowed role then deny access
        if (! roles.includes(accountRole)) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: `Account with role ${accountRole} is not authorized to access this route`,
                }),
                { status: 403 }
            );
        }

        return new NextResponse(
            JSON.stringify({
                success: true,
                message: "Authorized success",
            }),
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "Not authorized to access this route",
            }),
            { status: 401 }
        );
    }
}