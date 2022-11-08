/**
 * @format
 * @function register to  Register user
 * @function login to Login user
 * @function forgotPassword to get user password forgot
 * @function resetPassword to Reset User Password
 */
import User from '../models/User';
import ErrorResponse from '../utils/errorResponse';
import { sendEmail } from '../utils/sendEmail';
import { sendToken } from '../utils/sendToken';
import crypto from 'crypto';
const register = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const errorHandle = new ErrorResponse(
      'Please provide an email and password',
      400
    );
    return next(errorHandle);
  }
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    const isMatch = await user.matchPasswords(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    sendToken(user, 200, res);
  } catch (error) {
    console.log({ error }, 'error');
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Email could not be sent', 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save();
    const resetUrl = `http://localhost:2812/resetpassword/${resetToken}`;
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking='off'>${resetUrl}</a>
    `;
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password reset request',
        text: message,
      });
      res.status(200).json({
        success: true,
        data: 'Email sent',
      });
    } catch (error) {
      user.resetPasswordExpire = undefined;
      user.resetPasswordToken = undefined;

      await user.save();
      return next(new ErrorResponse('Email could not be send', 500));
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ErrorResponse('Invalid reset token', 404));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    console.log(req.body, 'request');
    await user.save();

    res.status(201).json({
      success: true,
      data: 'Password reset successful',
    });
  } catch (error) {
    next(error);
  }
};

export { register, login, forgotPassword, resetPassword };
