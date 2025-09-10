import { Request, Response } from 'express';
import prisma from '../db.js';

//@desc     Get user account profile data
//@route    //GET /api/v1/profile/:accountId
//@access   Public

export const getProfile = async (req: Request, res: Response) => {
  try {
    const accountId = (req.params.accountId ?? "").trim();

    // Case: invalid/missing input
    if (!accountId) {
      return res.status(400).json({
        success: false,
        message: "accountId param is required",
      });
    }

    const account = await prisma.account.findUnique({
      where: { AccountID: accountId },
      include: { user: true }, 
    });

    // Case: not found
    if (!account) {
      return res.status(404).json({ 
        success: false,
        message: 'Account not found' });
    }

    //join data from Account and User table to gather all required fields

    const payload = {
      accountId: account.AccountID,
      firstName: account.FirstName,
      lastName: account.LastName,
      email: account.user?.Email ?? null, 
    };

    return res.status(200).json({
      success: true,
      data: payload,
      message: "Profile fetched successfully",
    });

  } catch (err) {
    console.error('[getProfile] error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}