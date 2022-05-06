const joi = require('joi');

exports.registerSchema = joi.object().keys({
  email: joi.string().email().required().messages({
    'string.base': 'Field email must be a string',
    'string.empty': 'Email cannot be empty',
    'string.email': 'Email is not valid',
    'string.required': 'Email is required',
  }),
  password: joi.string().min(6).required().messages({
    'string.base': 'Field password must be a string',
    'string.empty': 'Password cannot be empty',
    'string.required': 'Password is required',
  }),
});
