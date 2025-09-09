import prisma from "@/db";
import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

//@desc     Register account
//@route    POST /api/v1/auth/register
//@access   Public
export const register = async (req: NextApiRequest, res: NextApiResponse) => {
    const { AccountID, Password, FirstName, LastName } = req.body || {};
    if (!AccountID || !Password || !FirstName || !LastName) {
        return res
            .status(400)
            .json({ error: "Please provide all require parameters" });
    }
    try {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = await prisma.account.create({
            data: {
                AccountID,
                Password: hashedPassword,
                FirstName,
                LastName,
            },
        });

        return new Response(
            JSON.stringify({
                success: true,
                data: newUser,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({
                message: "Error",
            }),
            { status: 500 }
        );
    }
};
