import express from 'express';
import { updateUser, deleteAccount } from '../controllers/user_data.js';

const router = express.Router();

router.put('/:accountId', updateUser);
router.delete('/:accountId', deleteAccount);

export default router;
