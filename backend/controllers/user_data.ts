import { Request, Response } from 'express';
import prisma from '../db.js';
import bcrypt from 'bcrypt';


//@desc     Update user data
//@route    PUT /api/v1//user/:accountId
//@access   Public
export const updateUser = async (req: Request, res: Response) => {
    const  accountId  = req.params.accountId;
    const { FirstName, LastName } = req.body;

    if (!FirstName && !LastName) {
        return res.status(500).json({
            success: false,
            error: 'Please provide at least one field to update (FirstName or LastName).',
        });
    }

    try {
        const updatedUser = await prisma.account.update({
            where: {
                AccountID: accountId,
            },
            data: {
                FirstName,
                LastName,
            },
        });

        res.status(200).json({
            success : true,
            data : updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: 'Error' 
        });
    }
};


