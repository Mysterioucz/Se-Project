import { Router } from 'express';
import { getProfile } from '../controllers/profile.js';

const router = Router();

// GET /api/profile/:accountId
router.get('/:accountId', getProfile);

export default router;