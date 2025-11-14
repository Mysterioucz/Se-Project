import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import { nextAuthOptions } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/account/{accountId}:
 *   get:
 *     summary: Get account details
 *     description: Retrieve account information (requires authentication)
 *     tags:
 *       - Account
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: accountId
 *         in: path
 *         description: Account ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     AccountID:
 *                       type: string
 *                     Email:
 *                       type: string
 *                     FirstName:
 *                       type: string
 *                     LastName:
 *                       type: string
 *             example:
 *               success: true
 *               data:
 *                 AccountID: "123e4567-e89b-12d3-a456-426614174000"
 *                 Email: "john.doe@example.com"
 *                 FirstName: "John"
 *                 LastName: "Doe"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "You do not have permission to perform this action."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error. Please try again later."
 *   put:
 *     summary: Update account
 *     description: Update account first name and/or last name (requires authentication)
 *     tags:
 *       - Account
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: accountId
 *         in: path
 *         description: Account ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updateFirstName:
 *                 type: string
 *                 example: John
 *               updateLastName:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 FirstName: "John"
 *                 LastName: "Doe"
 *       400:
 *         description: Missing parameters
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Missing required parameters. Please check your request."
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "You do not have permission to perform this action."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error. Please try again later."
 *   delete:
 *     summary: Delete account
 *     description: Delete account and all related data (requires authentication)
 *     tags:
 *       - Account
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - name: accountId
 *         in: path
 *         description: Account ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Account and related data are deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "You do not have permission to perform this action."
 *       404:
 *         description: Account not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Account not found."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal server error. Please try again later."
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ accountId: string }> },
) {
    const { accountId } = await params;
    const { updateFirstName, updateLastName } = await req.json();

    // If accountId doesn't match the token sent's ID
    const session = await getServerSession(nextAuthOptions);
    if (session?.user?.id != accountId) {
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.PERMISSION,
            }),
            { status: 401 },
        );
    }

    if (!updateFirstName && !updateLastName) {
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.MISSING_PARAMETER,
            }),
            { status: 400 },
        );
    }

    try {
        const updatedUser = await prisma.account.update({
            where: {
                AccountID: accountId,
            },
            data: {
                ...(updateFirstName && { FirstName: updateFirstName }), // Only update if provided
                ...(updateLastName && { LastName: updateLastName }), // Only update if provided
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: {
                    FirstName: updatedUser.FirstName,
                    LastName: updatedUser.LastName,
                },
            }),
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.SERVER,
            }),
            { status: 500 },
        );
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ accountId: string }> },
) {
    const { accountId } = await params;

    // If accountId doesn't match the token sent's ID
    const session = await getServerSession(nextAuthOptions);
    if (session?.user?.id != accountId) {
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.PERMISSION,
            }),
            { status: 401 },
        );
    }

    try {
        const acc = await prisma.account.findUnique({
            where: {
                AccountID: accountId,
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
            { status: 200 },
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.SERVER,
            }),
            { status: 500 },
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ accountId: string }> },
) {
    const { accountId } = await params;

    // If accountId doesn't match the token sent's ID
    const session = await getServerSession(nextAuthOptions);
    if (session?.user?.id != accountId) {
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.PERMISSION,
            }),
            { status: 401 },
        );
    }

    try {
        // Find account
        const account = await prisma.account.findUnique({
            where: {
                AccountID: accountId,
            },
        });

        if (!account) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: ErrorMessages.ACCOUNT_NOT_FOUND,
                }),
                { status: 404 },
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

            await prisma.report.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });

            // Admin's Part
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
            { status: 200 },
        );
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                success: false,
                message: ErrorMessages.SERVER,
            }),
            { status: 500 },
        );
    }
}
