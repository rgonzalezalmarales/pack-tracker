import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3000),
  DEFAULT_LIMIT: Joi.number().default(5),
  JWT_SECRET: Joi.required(),
  EMAIL_SERVER: Joi.required(),
  EMAIL_PORT: Joi.number().default(465),
  EMAIL_SECURE: Joi.boolean().default(true),
  EMAIL_USER: Joi.required(),
  EMAIL_PASSWORD: Joi.required(),
  EMAIL_FROM: Joi.required(),
  LINK_STATUS: Joi.required(),
});
