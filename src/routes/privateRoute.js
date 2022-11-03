/** @format */

import express from 'express';
import { getPrivateData } from '../controller/privateRoute';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/').get(protect, getPrivateData);

export default router;
