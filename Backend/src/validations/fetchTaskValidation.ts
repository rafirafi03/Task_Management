import Joi from "joi";

export const fetchTasksSchema = Joi.object({
  userId: Joi.string().required(),
});
