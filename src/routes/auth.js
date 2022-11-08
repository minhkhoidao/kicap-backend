/** @format */

import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from '../controller/auth';
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/forgot-password').post(forgotPassword);
router.route('/resetpassword/:resetToken').put(resetPassword);

export default router;
