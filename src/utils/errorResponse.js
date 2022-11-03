/**
 * @format
 * @param message is message error server response
 * @param statusCode is status code server response
 */

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ErrorResponse;
