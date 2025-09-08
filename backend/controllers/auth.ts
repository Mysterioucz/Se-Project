import { Request, Response } from 'express';
import prisma from '../db.js';
import bcrypt from 'bcrypt';
import { Account } from '../src/generated/prisma/index.js';
import jwt from 'jsonwebtoken';

//@desc     Register account
//@route    POST /api/v1/auth/register
//@access   Public
export const register = async (req: Request, res: Response) => {
    const {AccountID, Password, FirstName, LastName} = req.body || {};
    if (!AccountID || !Password || !FirstName || !LastName) {
        return res
          .status(500)
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

//@desc     Login
//@route    POST /api/v1/auth/login
//@access   Public
export const login = async (req: Request, res: Response) => {
    const { AccountID, Password } = req.body; // need to change to Email later
        
    if (! AccountID || ! Password) {
        return res.status(400).json({
            success: false,
            message: `Please provide all require parameters`
        });
    }

    try {
        const account = await prisma.account.findUnique({
            where: { AccountID: AccountID }
        });

        console.log('Find Unique Passed');
        if (! account) {
            return res.status(404).json({
                success: false,
                message: `User not found`
            })
        }

        const isMatch = await bcrypt.compare(Password, account.Password);

        if (! isMatch) {
            return res.status(401).json({
                success: false,
                message: `Invalid credentials`
            });
        }
        // return res.status(200).json({
        //     accountPass: account.Password,
        //     inPass: Password
        // });

        const payload = {
            AccountID: account.AccountID,
            FirstName: account.FirstName,
            LastName: account.LastName,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, {
            expiresIn: '1h', // Expire the token in 1 hour (you can change this duration)
        });

        const options: { expires: Date; httpOnly: boolean;} = {
            expires: new Date(Date.now() + (Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000)), // Cookie expiration time
            httpOnly: true, // Ensures cookie is not accessible via JavaScript
        };

        res.status(200)
        .cookie("token", token, options)
        .json({
            success: true,
            AccountID: account.AccountID,
            FirstName: account.FirstName,
            LastName: account.LastName,
            token: token,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

//@desc   Log user out / clear token
//@route  POST /api/v1/auth/logout
//@access Private
export const logout = async (req: Request, res: Response) => {
    res.cookie("token", "none", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        data: {},
    });
};