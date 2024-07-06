import Joi from "joi";

export const validateGoogleOAuth = Joi.object({
    code: Joi.string().required(),
});