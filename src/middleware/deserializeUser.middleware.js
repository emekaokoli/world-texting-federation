const dotenv = require('dotenv').config();
const logger = require('consola');
const { get, omit } = require('lodash');
const httpError = require('http-errors');

const { jwtVerify } = require('../utils/jwt.utils');
const { findById } = require('../models/user.model');
const {
  reIssueAccessToken,
} = require('../controllers/register.controller');
const { findUserById } = require('../services/user.service');

const deserializeUser = async (req, res, next) => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );
  const refreshToken = get(req, 'headers.refreshtoken');

  if (!accessToken) {
    return next();
  }

  try {
    const { decoded, expired } = jwtVerify(accessToken);
    if (expired) return next();

    if (decoded) {
      req.user = decoded;
      return next();
    }

    if (expired && refreshToken) {
      const newAccessToken = await reIssueAccessToken({
        refreshToken,
      });
      if (newAccessToken) {
        return res.setHeader('x-access-token', newAccessToken);
      }

      const { decoded } = jwtVerify(newAccessToken);
      req.user = decoded;
      return next();
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = deserializeUser;
