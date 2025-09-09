import { Request, Response } from 'express';
import prisma from '../db.js';
import { Account, User_Tel_No, User,  } from '../src/generated/prisma/index.js';

//@desc     Update user data
//@route    PUT /api/v1//user/:accountId
//@access   Public
export const updateUser = async (req: Request, res: Response) => {
    const  accountId  = req.params.accountId;
    const { FirstName, LastName } = req.body;

    if (!FirstName && !LastName) {
        return res.status(400).json({
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

//@desc     Delete account data
//@route    DELETE /api/v1/user/:accountId
//@access   Private
export const deleteAccount = async (req: Request, res: Response) => {
	const accountId  = req.params.accountId;
	
	try {
		// Find account
        const account = await prisma.account.findUnique({
            where: { 
                AccountID: accountId 
            },
        });

        if (! account) {
            return res.status(404).json({
                success: false,
                message: `Account not found`,
            });
        }

        // Start a transaction to ensure that all operations are executed atomically
        await prisma.$transaction(async (prisma) => {
            // Delete related records in USER_TEL_NO
            await prisma.user_Tel_No.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });
            
            await prisma.user.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });

            await prisma.session.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });

            // Delete related records in ASSIGNED_TO
            await prisma.assigned_To.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });

            // Update PURCHASE to set UserAccountID to NULL
            await prisma.purchase.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });

            // Delete related records in REPORT_TO
            await prisma.report_To.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });

            // Delete related records in REPORT
            await prisma.report.deleteMany({
                where: {
                    UserAccountID: accountId,
                },
            });

            await prisma.admin.deleteMany({
                where: {
                    AdminAccountID: accountId,
                },
            });
            await prisma.report_To.deleteMany({
                where: {
                    AdminAccountID: accountId,
                },
            });
            await prisma.report.deleteMany({
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
            // delete the account
            await prisma.account.delete({
                where: {
                    AccountID: accountId,
                },
            });

        });

        return res.status(200).json({
            success: true,
            message: `Account and related data deleted successfully`,
        });
	} catch(err) {
		console.log(err);
		res.status(500).json({
			success: false,
			message: `Server Error`
		});
	}
};