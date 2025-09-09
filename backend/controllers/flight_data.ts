import { Request, Response } from 'express';
import prisma from '../db.js';
import bcrypt from 'bcrypt';


//@desc     Get all flights
//@route    GET /api/v1//flights
//@access   Public
export const getFlights = async (req: Request, res: Response) => {
    
    const flights = await prisma.flight.findMany();

    try {
        
        res.status(200).json({
            success : true,
            count : flights.length,
            data : flights
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: 'Error' 
        });
    }
};


//@desc     Get flight by id
//@route    GET /api/v1//flights
//@access   Public
export const getFlightByNo = async (req: Request, res: Response) => {
    
    const flightNo = req.params.flightNo;

    const flight = await prisma.flight.findUnique({
        where: {
            FlightNo : flightNo,
        },

    });

    if (!flight) {
        return res.status(404).json({
            success: false,
            error: `Flight not found with Flight Number ${flightNo}`,
        });
    }

    try {
        
        res.status(200).json({
            success : true,
            data : flight,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            message: 'Error' 
        });
    }
};


