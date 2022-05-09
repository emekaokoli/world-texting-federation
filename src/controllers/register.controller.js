const { omit, get } = require('lodash');
const logger = require('consola');
const httpError = require('http-errors');
const {
  findRegUser,
  createUserAccount,
  deleteUserAccountById,
  findUserById,
  createUserSession,
} = require('../services/register.service');
const { validatePassword } = require('../services/user.service');
const { jwtSign } = require('../utils/jwt.utils');

exports.userRegisterHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await findRegUser({ email });
    if (user) {
      throw new httpError.BadRequest('User already exists');
    }

    const newUser = await createUserAccount({ email, password });

    return res.status(201).json({
      success: true,
      user: omit(newUser.toJSON(), ['password', '__v']),
      message: 'Account created successfully',
    });
  } catch (error) {
    return next(error);
  }
};

exports.reIssueAccessToken = async ({ resfreshToken }) => {
  const { decoded } = jwtVerify(refreshToken);
  if (!decoded || !get(decoded, 'session')) return false; // invalid refresh token
  const user = await findRegUser({ email });
  if (!user) return false; // invalid user

  const userSession = await findUserById({ _id: user._id });
  if (!userSession) return false;

  const accessToken = signJwt(
    {
      _id: userSession._id,
      email: userSession.email,
      session: userSession._id,
    },
    { expiresIn: process.env.REFRESHTOKEN_TIME_TO_LIVE } // 1year
  );

  return accessToken;
};

exports.deleteAccountHandle = async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    const userId = await findUserById({ id });

    if (!userId) {
      return next(httpError(404, 'Id not found'));
    }
    await deleteUserAccountById(userId);
    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};

exports.userSessionHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { existingUser, isValid } = await validatePassword({
      email,
      password,
    });
    if (!isValid) {
      return next(httpError(401, 'Invalid credentials'));
    }
    if (!existingUser) {
      return next(httpError(401, 'Invalid credentials'));
    }

    const createdUser = await createUserSession(existingUser._id);

    const accessToken = jwtSign(
      {
        _id: createdUser._id,
        email: createdUser.email,
        session: createdUser._id,
      },
      { expiresIn: process.env.ACCESSTOKEN_TIME_TO_LIVE } // 30days
    );

    const refreshToken = jwtSign(
      {
        _id: createdUser._id,
        email: createdUser.email,
        session: createdUser._id,
      },
      { expiresIn: process.env.REFRESHTOKEN_TIME_TO_LIVE } // 1year
    );

    return res.status(201).json({
      success: true,
      message: 'Session created successfully',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.trace(error.message);
    return next(error);
  }
};
