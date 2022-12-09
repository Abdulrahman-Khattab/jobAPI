const { UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Invalid authorization');
  }

  try {
    const token = authHeader.split(' ')[1];
    const finalValue = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { userId: finalValue.userId, username: finalValue.name };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Invalid authorization');
  }
};

module.exports = auth;
