const { omit } = require('lodash');
const logger = require('consola');
const httpError = require('http-errors');

const {
  createUser,
  validatePassword,
  findUser,
  findAllUsers,
} = require('../services/user.service');
const { jwtSign, jwtVerify } = require('../utils/jwt.utils');

exports.handleCreateUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { isValid, existingUser } = await validatePassword(
      email,
      password
    );
    if (!existingUser) {
      return next(httpError(404, 'User account not found'));
    }
    if (!isValid) {
      return next(httpError(401, 'Invalid username or password'));
    }
    const { _id, email: userEmail } = existingUser;
    const token = jwtSign(
      { _id, userEmail, user: _id },
      { expiresIn: process.env.ACCESSTOKEN_TIME_TO_LIVE } // 30Days
    );
    let accessToken = '';
    if (!existingUser) {
      const _user = await createUser({ email, password });
      const token = jwtSign(
        { _id: _user._id, email: _user.email, user: _user._id },
        { expiresIn: process.env.ACCESSTOKEN_TIME_TO_LIVE } // 30Days
      );
      res.set('Authorization', token);
      accessToken = token;
    }
    res.set('Authorization', token);
    const userToken = token ? token : accessToken;
    return res.send({
      userAccount: omit(existingUser.toJSON(), [
        'password',
        '__v',
        'createdAt',
        'updatedAt',
      ]),
      accessToken: userToken,
    });
  } catch (error) {
    return next(error);
  }
};
