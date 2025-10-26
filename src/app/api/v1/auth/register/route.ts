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
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
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

        const newAccount = await prisma.account.create({
            data: {
                Email,
                Password: hashedPassword,
                FirstName,
                LastName,
            },
        });

        const accountID = newAccount?.AccountID;
        await prisma.user.create({
            data: {
                UserAccountID: accountID,
            },
        });

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
            }),
            { status: 500 },
        );
    }
}
