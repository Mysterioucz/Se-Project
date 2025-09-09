import express from 'express';
import { getAirports, createAirport } from '../controllers/airports.js';

const router = express.Router();

router.get('/', getAirports);
router.post('/', createAirport);

export default router;
