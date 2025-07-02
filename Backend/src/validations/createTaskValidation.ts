import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  userId: Joi.string().required(),
});
