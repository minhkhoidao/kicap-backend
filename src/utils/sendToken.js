/**
 * @format
 * @param user {object} is variable in database create
 * @param statusCode {number} is status code of controller
 * @param res {response} is response of server
 */

export const sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken();
  res.status(statusCode).json({
    success: true,
    token,
  });
};
