const { StatusCodes } = require('http-status-codes');
const { UserModel } = require('../db/models');
const jwt = require('../utils/helpers/jwt.helper');
const { ValidationException, NotFoundException, UnauthorizedException } = require('../utils/exceptions');

async function register(req, res) {
  let user = await UserModel.findOne({ email: { $regex: `^${req.body.email}$`, $options: 'i' } });
  if (user && user.is_active) {
    throw new ValidationException('User already exists.', { email: ['email already used!.'] });
  }
  if (!user) {
    user = await UserModel.create({
      ...req.body,
      email: req.body.email.toLowerCase(),
      avatar: `https://ui-avatars.com/api/?name=${req.body.firstName[0]}${req.body.lastName[0]}&background=000&color=fff`,
    });
  }
  const token = await jwt.sign({ id: user._id.toString() }, { expiresIn: '600000ms' });
  let { password: _password, ...data } = user.toJSON();
  return res.status(StatusCodes.OK).json({
    status: true,
    statusCode: StatusCodes.OK,
    message: 'You have been registered successfully. Please login to start your session.',
    data,
  });
}

async function login(req, res) {
  const user = await UserModel.findOne({ email: { $regex: `^${req.body.email}$`, $options: 'i' } });
  if (!user) {
    throw new NotFoundException('User not found.');
  }
  try {
    const varified = await user.comparePassword(req.body.password);
    if (varified) {
      if (user.is_active === false) {
        throw new UnauthorizedException('User is not varified.');
      }
      let { password: _password, ...data } = user.toJSON();
      return res.status(StatusCodes.OK).json({
        status: true,
        statusCode: StatusCodes.OK,
        message: 'User logged in successfully.',
        data: { user: data, accessToken: await jwt.sign(data) },
      });
    }
  } catch (err) {
    console.log('============================================');
    console.log('[DEBUG] login::failed password varification', err.message || err.toString(), err.stack);
    console.log('============================================');
  }
  throw new UnauthorizedException('Invalid username and password.');
}

async function profile(req, res) {
  const user = await UserModel.findOne({ _id: req.user._id });
  let { password: _password, ...data } = user.toJSON();
  return res.status(StatusCodes.OK).json({
    status: true,
    statusCode: StatusCodes.OK,
    data: { user: data, accessToken: await jwt.sign(data) },
  });
}

module.exports = { register, login, profile };
