const userModel = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
  const user = await userModel.create({ ...req.body });

  const token = user.generateJWT();

  res.status(StatusCodes.CREATED).json({ token, userr: { name: user.name } });
};

const login = async (req, res) => {
  const { password, email } = req.body;
  if (!password || !email) {
    throw new BadRequestError('Please provide email or password');
  }
  const user = await userModel.findOne({ email });
  // console.log(user);
  if (!user) {
    throw new UnauthenticatedError('User does not exist');
  }

  const verifiedPassword = await user.comparePasswords(password);
  console.log(verifiedPassword);

  if (!verifiedPassword) {
    throw new UnauthenticatedError(' un valid password');
  }

  const token = user.generateJWT();

  // console.log(token);

  res
    .status(StatusCodes.OK)
    .json({ value: token, username: { name: user.name } });
};

module.exports = { register, login };
