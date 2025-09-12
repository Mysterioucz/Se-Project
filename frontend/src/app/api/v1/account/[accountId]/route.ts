import prisma from "@/db";
import { authorize } from "@/src/lib/authMiddleware";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/src/lib/auth";

interface JwtPayload {
    AccountID: string;
    Email: string;
    FirstName: string;
    LastName: string;
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ accountId: string }> }
) {
    const protect = await authorize(req, ['User', 'Admin']);
    if (protect.status != 200) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authorized to this route'
            }),
            { status: 401 }
        );
    }

    const { accountId } = await params;
    const { updateFirstName, updateLastName } = await req.json();

    // If accountId doesn't match the token sent's ID
   const session = await getServerSession(nextAuthOptions);
    if (session?.user?.id != accountId) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authorized to this route'
            }),
            { status: 401 }
        );
    }

    if (! updateFirstName && ! updateLastName) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Please provide at least one field to update (FirstName or LastName).",
            }),
            { status: 400 }
        );
    }

    try {
        const updatedUser = await prisma.account.update({
            where: { 
                AccountID: accountId 
            },
            data: {
                ...(updateFirstName && { FirstName: updateFirstName }), // Only update if provided
                ...(updateLastName && { LastName: updateLastName }),   // Only update if provided
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    FirstName: updatedUser.FirstName,
                    LastName: updatedUser.LastName
                }
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

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ accountId: string }> }
) {

    const { accountId } = await params;

    // If accountId doesn't match the token sent's ID
    const session = await getServerSession(nextAuthOptions);
    if (session?.user?.id != accountId) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authorized to this route'
            }),
            { status: 401 }
        );
    }

    try {
        const acc = await prisma.account.findUnique({
            where: {
                AccountID: accountId 
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    AccountID: acc?.AccountID,
                    Email: acc?.Email,
                    FirstName: acc?.FirstName,
                    LastName: acc?.LastName,
                },
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

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ accountId: string }> }
) {
    const { accountId } = await params;

    // If accountId doesn't match the token sent's ID
    const session = await getServerSession(nextAuthOptions);
    if (session?.user?.id != accountId) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authorized to this route'
            }),
            { status: 401 }
        );
    }

    if (session?.user?.id != accountId) {
        return new Response(
            JSON.stringify({
                success: false,
                message: 'Not authorized to this route'
            }),
            { status: 401 }
        );
    }

    try {
        // Find account
        const account = await prisma.account.findUnique({
            where: { 
                AccountID: accountId 
            },
        });

        if (! account) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found",
                }),
                { status: 404 }
            );
        }

        // Start a transaction to ensure that all operations are executed atomically
        await prisma.$transaction(async (prisma) => {
            // User's Part
            await prisma.user_Tel_No.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });
            
            await prisma.assigned_To.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });

            await prisma.purchase.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });

            await prisma.report_To.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });

            await prisma.report.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });
            
            // Admin's Part
            await prisma.report.deleteMany({
                where: {
                    AdminAccountID: accountId,
                },
            });

            await prisma.report_To.deleteMany({
                where: {
                    AdminAccountID: accountId,
                },
            });
            
            await prisma.airline_Message.deleteMany({
                where: {
                    AdminAccountID: accountId,
                },
            });
            await prisma.contact.deleteMany({
                where: {
                    AdminAccountID: accountId,
                },
            });
            
            await prisma.admin.deleteMany({
                where: {
                    AdminAccountID: accountId,
                },
            });

            await prisma.user.delete({
                where: {
                    UserAccountID: accountId,
                },
            });

            await prisma.account.delete({
                where: {
                    AccountID: accountId,
                },
            });
        });

        return new Response(
            JSON.stringify({
                success: true,
                message: "Account and related data are deleted successfully",
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
