import Joi from "joi";

export const deleteTaskSchema = Joi.object({
  taskId: Joi.string().required(),
});
