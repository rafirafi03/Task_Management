import Joi from 'joi';

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(100),
  status: Joi.string().valid('pending', 'in-progress', 'completed'),
});
