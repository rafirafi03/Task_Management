import Joi from "joi";

export const updateTaskSchema = Joi.object({
  taskId: Joi.string().required(),
  title: Joi.string().min(3).max(100),
});
