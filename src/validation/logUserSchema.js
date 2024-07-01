import Joi from "joi";

export const logUserSchema = Joi.object({
    password: Joi.string().required().min(3),
    email: Joi.string().email().required()
});