import express from 'express';
import { updateUser } from '../controllers/user_data.js';

const router = express.Router();

router.put('/:accountId', updateUser);

export default router;
