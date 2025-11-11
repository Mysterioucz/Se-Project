import prisma from "@/db";
import { ErrorMessages } from "@/src/enums/ErrorMessages";
import bcrypt from "bcrypt";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register new account
 *     description: Create a new user account with email and password
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Email
 *               - Password
 *               - FirstName
 *               - LastName
 *             properties:
 *               Email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               Password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123
 *               FirstName:
 *                 type: string
 *                 example: John
 *               LastName:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       200:
 *         description: Account created successfully
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
 *                 Email: "user@example.com"
 *                 FirstName: "John"
 *                 LastName: "Doe"
 *       400:
 *         description: Missing required parameters
 *         content:
 *           application/json:
 *             example:
 *               message: "Missing required parameters. Please check your request."
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Internal server error. Please try again later."
 */
export async function POST(req: NextRequest) {
    const { Email, Password, FirstName, LastName } = await req.json();
    if (!Password || !FirstName || !LastName || !Email) {
        return new Response(
            JSON.stringify({
                message: ErrorMessages.MISSING_PARAMETER,
            }),
            { status: 400 },
        );
    }
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(Password, salt);
        console.log("salted");

        const newAccount = await prisma.account.create({
            data: {
                Email,
                Password: hashedPassword,
                FirstName,
                LastName,
            },
        });
        console.log("UserCreated", newAccount);
        const accountID = newAccount?.AccountID;
        await prisma.user.create({
            data: {
                UserAccountID: accountID,
            },
        });
        console.log("account created with id", accountID);
        return new Response(
            JSON.stringify({
                success: true,
                data: newAccount,
            }),
            { status: 200 },
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                message: ErrorMessages.SERVER,
                error: error,
            }),
            { status: 500 },
        );
    }
}
