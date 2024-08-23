import Joi from 'joi';

export const userSchema = Joi.object({
  firstName: Joi.string().min(3).max(50).optional(),
  lastName: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  reqresId: Joi.number().required(),
}).options({ abortEarly: false, allowUnknown: true });
