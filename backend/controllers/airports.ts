import { Request, Response } from 'express';
import prisma from '../db.js';

//@desc     Get airports
//@route    GET /api/v1/airports
//@access   Public
export const getAirports = async (req: Request, res: Response) => {
    try {
        const airports = await prisma.airport.findMany();
        
        res.status(200).json(airports);
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: 'Error' 
        });
    }
};

//@desc     Create an airport
//@route    POST /api/v1/airports
//@access   Private
export const createAirport = async (req:Request, res:Response) => {
    const { AirportID, AirportName, City, Country } = req.body;

    if (!AirportID || ! AirportName || ! City || ! Country) {
        return res.status(400).json({
            message: `Something is missing`
        });
    }

    try {
        const newAirport = await prisma.airport.create({
            data: {
                AirportID,
                AirportName,
                City,
                Country
            }
        });

        res.status(200).json({
            success: true,
            data: newAirport
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Server Error'
        });
    }
};
