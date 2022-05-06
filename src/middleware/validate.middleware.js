const createError = require('http-errors');
const { BodySchema, idSchema } = require('../schema/acronym.schema');
const { registerSchema } = require('../schema/register.schema');
const { userSchema } = require('../schema/user.schema');

const validateRequestBody = (req, res, next) => {
  const results = BodySchema.validate(req.body);
  if (results.error) {
    return next(createError(400, results.error.details[0].message));
  }
  return next();
};

const validateId = (req, res, next) => {
  const results = idSchema.validate(req.params.acronym);
  if (results.error) {
    return next(createError(400, results.error.details[0].message));
  }
  return next();
};

const validateAuth = (req, res, next) => {
  const results = userSchema.validate(req.body);
  if (results.error) {
    return next(createError(400, results.error.details[0].message));
  }
  return next();
};

const validateRegister = (req, res, next) => {
  const results = registerSchema.validate(req.body);
  if (results.error) {
    return next(createError(400, results.error.details[0].message));
  }
  return next();
};

module.exports = {
  validateRequestBody,
  validateId,
  validateAuth,
  validateRegister,
};
