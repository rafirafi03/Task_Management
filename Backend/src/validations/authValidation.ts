import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().min(3),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
