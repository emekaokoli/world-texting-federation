const joi = require('joi');
joi.objectId = require('joi-objectid')(joi);

const BodySchema = joi.object().keys(
  {
    symbolName: joi
      .string()
      .required()
      .messages({
        'string.base': 'Field must be a string',
        'string.empty': 'symbolName cannot be empty',
        'string.required': 'symbolName is required',
      })
      .min(1),
    description: joi.string().required().messages({
      'string.base': 'Field description must be a string',
      'string.empty': 'Description cannot be empty',
      'string.required': 'Description is required',
    }),
  },
  { timestamp: true }
);
const idSchema = joi.objectId().required().messages({
  'objectid.base': 'id must be a valid ObjectId',
  'objectid.empty': 'required, id cannot be empty. ',
  'objectid.required': 'id is required',
});

module.exports = { BodySchema, idSchema };
