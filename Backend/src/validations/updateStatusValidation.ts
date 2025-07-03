import Joi from "joi";

export const updateStatusSchema = Joi.object({
  taskId: Joi.string().required(),
  status: Joi.string().valid("pending", "in-progress", "completed"),
});
