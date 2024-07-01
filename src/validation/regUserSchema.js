import Joi from "joi";

export const regUserSchema = Joi.object({
    name: Joi.string().required().min(3).max(20),
    password: Joi.string().required().min(3),
    email: Joi.string().required().email()
});