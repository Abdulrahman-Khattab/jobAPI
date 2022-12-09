const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'something wrong try again later',
  };

  // Duplicate Error

  if (err.code === 11000) {
    customError.status = 401;
    customError.msg = 'This email is already registered';
  }

  // Validation error
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
  }

  if (err.name === 'CastError') {
    customError.msg = 'Invalid Id ';
    customError.statusCode = 401;
  }
  //if (err instanceof CustomAPIError) {
  //return res.status(err.statusCode).json({ msg: err.message });
  //}

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ customError });
};

module.exports = errorHandlerMiddleware;
