import express from 'express';
import { getFlights, getFlightByNo } from '../controllers/flight_data.js';

const router = express.Router();

router.get('/', getFlights)
router.get('/:flightNo', getFlightByNo);

export default router;
