import { Request, Response } from 'express';
import prisma from '../db.js';
import bcrypt from 'bcrypt';


//@desc     Register account
//@route    POST /api/v1/auth/register
//@access   Public
export const register = async (req: Request, res: Response) => {
    const {AccountID, Password, FirstName, LastName} = req.body || {};
    if (!AccountID || !Password || !FirstName || !LastName) {
        return res
          .status(400)
          .json({error : "Please provide all require parameters"});
    }
    try {
        const salt = 12;
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newUser = await prisma.account.create({
            data: {
                AccountID,
                Password : hashedPassword,
                FirstName,
                LastName
            },
        });
        
        res.status(200).json({
            success : true,
            data : newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: 'Error' 
        });
    }
};


